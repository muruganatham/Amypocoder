import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
import { PreviewManager } from './webview/PreviewManager';
import { SidebarProvider } from './providers/SidebarProvider';
import { ProjectDetector } from './core/ProjectDetector';

let isProcessing = false;
let globalPreviewManager: PreviewManager | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('[Amypo Browser] Activating…');

    const projectDetector = new ProjectDetector();
    const previewManager  = PreviewManager.getInstance(context.extensionUri);
    globalPreviewManager  = previewManager;

    const sidebarProvider = new SidebarProvider(
        context.extensionUri,
        projectDetector,
        previewManager
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            SidebarProvider.viewType,
            sidebarProvider
        )
    );

    /**
     * amypo.toggleBrowser
     * Multi-Server Responsive Toggle
     */
    const toggleCmd = vscode.commands.registerCommand('amypo.toggleBrowser', async () => {
        if (isProcessing) return;

        // 1. If already open -> Close Browser
        if (previewManager.isOpen) {
            previewManager.toggle();
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage('Amypo Browser: Please open a folder.');
            return;
        }

        // Prioritize Active Root
        let activeRoot = workspaceFolders[0].uri.fsPath;
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const folder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
            if (folder) activeRoot = folder.uri.fsPath;
        }

        isProcessing = true;
        try {
            await vscode.window.withProgress(
                { location: vscode.ProgressLocation.Notification, title: 'Amypo Browser', cancellable: false },
                async (progress) => {
                    progress.report({ message: 'Detecting services…' });

                    const projects = await projectDetector.detect(activeRoot);
                    if (projects.length === 0) {
                        previewManager.open([{ type: 'static', category: 'static', rootPath: activeRoot, port: 5500, startCommand: '', label: 'Local Dev' }]);
                        return;
                    }

                    progress.report({ message: 'Launching Dashboard…' });
                    previewManager.open(projects);
                }
            );
        } finally {
            isProcessing = false;
        }
    });

    /**
     * NEW FEATURE: Auto-Reload on File Save (v1.3)
     * Detects changes in the workspace and automatically refreshes the browser.
     */
    const autoReloadListener = vscode.workspace.onDidSaveTextDocument((doc) => {
        // Only reload if it's a code/style/markup file
        const ext = doc.fileName.split('.').pop()?.toLowerCase();
        const validExts = ['ts', 'js', 'tsx', 'jsx', 'html', 'css', 'scss', 'json', 'py', 'php', 'java'];
        
        if (previewManager.isOpen && validExts.includes(ext || '')) {
            console.log('[Amypo Browser] Auto-Reload triggered by file save:', doc.fileName);
            previewManager.navigate('refresh');
        }
    });

    const openCmd    = vscode.commands.registerCommand('amypo.openSimpleBrowser',
        () => vscode.commands.executeCommand('amypo.toggleBrowser'));

    const refreshCmd = vscode.commands.registerCommand('amypo.refreshBrowser',
        () => previewManager.navigate('refresh'));

    const submitCmd = vscode.commands.registerCommand('amypo.submitTest', async () => {
        if (previewManager.currentTest) {
            const { testPath, testId } = previewManager.currentTest;
            await submitEduTest(testPath, testId);
        } else {
            vscode.window.showInformationMessage('No active test to submit.');
        }
    });

    context.subscriptions.push(toggleCmd, openCmd, refreshCmd, submitCmd, autoReloadListener,
        { dispose: () => {
            previewManager.dispose();
        }});


    // ✅ Amypo EduTech - Handle URL Protocol
    // amypo://starttest?repo=...&question=...
    context.subscriptions.push(
        vscode.window.registerUriHandler({
            handleUri: async (uri: vscode.Uri) => {
                console.log('[Amypo EduTech] URI received:', uri.toString());
                
                if (uri.path === '/starttest') {
                    const params = new URLSearchParams(uri.query);
                    const repoUrl = params.get('repo');
                    const questionUrl = params.get('question');
                    const testId = params.get('testId');
                    const folder = params.get('folder'); // Support for opening specific subfolders

                    if (!repoUrl || !questionUrl) {
                        vscode.window.showErrorMessage('Invalid test URL!');
                        return;
                    }

                    await startEduTest(repoUrl, questionUrl, testId, folder, previewManager);
                } else if (uri.path === '/submittest') {
                    const params = new URLSearchParams(uri.query);
                    const testId = params.get('testId');
                    
                    if (!previewManager.currentTest) {
                        vscode.window.showErrorMessage('No active test found to submit.');
                        return;
                    }

                    await submitEduTest(
                        previewManager.currentTest.testPath,
                        testId || previewManager.currentTest.testId
                    );
                }
            }
        })
    );

    vscode.commands.executeCommand('setContext', 'amypo.browserOpen', false);
}

async function startEduTest(
    repoUrl: string,
    questionUrl: string,
    testId: string | null,
    folder: string | null,
    previewManager: PreviewManager
) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Amypo EduTech',
        cancellable: false
    }, async (progress) => {

        // Step 1 — Clone repo
        progress.report({ message: 'Cloning test repository...' });
        const testPath = path.join(
            os.homedir(), 
            'AmypoTests', 
            testId || 'current-test'
        );

        try {
            // Clean old test if exists
            if (fs.existsSync(testPath)) {
                fs.rmSync(testPath, { recursive: true });
            }

            // Ensure parent directory exists
            const parentDir = path.dirname(testPath);
            if (!fs.existsSync(parentDir)) {
                fs.mkdirSync(parentDir, { recursive: true });
            }

            let finalRepoUrl = repoUrl;
            if (!repoUrl.startsWith('http') && !repoUrl.startsWith('git@')) {
                // If it's just a repo name, assume it's under the Badsena GitHub organization
                finalRepoUrl = `https://github.com/${repoUrl.includes('/') ? repoUrl : 'Badsena/' + repoUrl}`;
            }

            // ✅ Clone with real await
            progress.report({ message: 'Cloning test repository...' });
            await execAsync(`git clone "${finalRepoUrl}" "${testPath}"`);

        } catch (err) {
            vscode.window.showErrorMessage(`Failed to clone repo: ${err}`);
            return;
        }

        // ✅ Open folder safely in current workspace (Prevents extension host reload)
        progress.report({ message: 'Opening project...' });
        const openPath = folder ? path.join(testPath, folder) : testPath;
        const uri = vscode.Uri.file(openPath);
        
        const currentFolders = vscode.workspace.workspaceFolders || [];
        const isAlreadyOpen = currentFolders.some(f => f.uri.fsPath === uri.fsPath);
        
        if (!isAlreadyOpen) {
            vscode.workspace.updateWorkspaceFolders(currentFolders.length, 0, { uri: uri });
        }

        // ✅ Small settle time then navigate
        progress.report({ message: 'Loading question...' });
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
        
        previewManager.open([{
            type: 'static',
            category: 'static',
            rootPath: openPath,
            port: 0,
            startCommand: '',
            label: 'Test Question'
        }]);

        previewManager.navigate(questionUrl);

        // Step 4 — Show submit button notification
        const submit = await vscode.window.showInformationMessage(
            '✅ Test started! Complete your project and click Submit when ready.',
            'Submit Test'
        );

        if (submit === 'Submit Test') {
            await submitEduTest(openPath, testId);
        } else {
            // Store for sidebar access
            previewManager.currentTest = { testPath: openPath, testId };
            previewManager.refreshStatus(); // Helper to notify sidebar
        }
    });
}

async function submitEduTest(testPath: string, testId: string | null) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Submitting test...',
        cancellable: false
    }, async (progress) => {

        // Push to GitHub
        progress.report({ message: 'Pushing code to GitHub...' });
        try {
            await execAsync('git add .', { cwd: testPath });
            await execAsync('git commit -m "Test submission - Amypo Coder"', { cwd: testPath });
            await execAsync('git push', { cwd: testPath });
        } catch (err) {
            console.error('[Amypo] Git push failed:', err);
            vscode.window.showErrorMessage('Failed to push code to GitHub. Please try again.');
        }

        progress.report({ message: 'Notifying portal...' });

        // Notify API
        try {
            await fetch('https://your-edutech-api.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, status: 'submitted' })
            });
        } catch (err) {
            console.error('[Amypo] API notification failed:', err);
        }

        vscode.window.showInformationMessage(
            '🎉 Test submitted successfully!'
        );
    });
}

export function deactivate() {
    if (globalPreviewManager) globalPreviewManager.dispose();
}
