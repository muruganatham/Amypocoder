import * as vscode from 'vscode';
import { getBrowserTemplate } from './browserTemplate';
import { ProjectInfo } from '../core/ProjectDetector';
 
export class PreviewManager {
    private static _instance: PreviewManager | undefined;
    private _panel: vscode.WebviewPanel | undefined;
    private _extensionUri: vscode.Uri;
    
    // Status Change Event
    private _onStatusChange = new vscode.EventEmitter<void>();
    public readonly onStatusChange = this._onStatusChange.event;

    // Running Terminals
    private _terminals = new Map<string, vscode.Terminal>();

    // EduTech Metadata
    public currentTest: { testPath: string, testId: string | null } | undefined;
 
    private _dynamicPorts = new Set<number>();
    private _currentProjects: ProjectInfo[] = [];
    private _terminalDataListener: vscode.Disposable | undefined;

    private constructor(extensionUri: vscode.Uri) {
        if (!extensionUri) {
            throw new Error('[PreviewManager] extensionUri is required');
        }
        this._extensionUri = extensionUri;

        // ✅ Attach Passive Sniffer for dynamic port extraction
        if ((vscode.window as any).onDidWriteTerminalData) {
            this._terminalDataListener = (vscode.window as any).onDidWriteTerminalData((e: any) => {
                const text = e.data;
                const match = text.match(/(?:(?:http:\/\/)?localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{2,5})/i);
                if (match && match[1]) {
                    const port = parseInt(match[1], 10);
                    if (!this._dynamicPorts.has(port)) {
                        this._dynamicPorts.add(port);
                        
                        // Ignore if project detector already found this port
                        if (!this._currentProjects.some(p => p.port === port)) {
                            this._currentProjects.push({
                                type: 'dynamic',
                                category: 'frontend',
                                rootPath: '',
                                port: port,
                                startCommand: '',
                                label: 'Sniffed Port :' + port
                            });
                            
                            // Immediately sync to the Amypo Dashboard UI
                            if (this._panel) {
                                this._panel.webview.postMessage({ type: 'updateProjects', projects: this._currentProjects });
                            }
                        }
                    }
                }
            });
        }
    }

    /** Manually trigger a status update to listeners */
    public refreshStatus(): void {
        this._onStatusChange.fire();
    }
 
    /** Singleton accessor */
    public static getInstance(extensionUri: vscode.Uri): PreviewManager {
        if (!PreviewManager._instance) {
            PreviewManager._instance = new PreviewManager(extensionUri);
        }
        return PreviewManager._instance;
    }
 
    /** Returns true if the panel is currently visible */
    public get isOpen(): boolean {
        return !!this._panel;
    }
 
    /**
     * Toggle the browser panel.
     */
    public toggle(projects?: ProjectInfo[]): void {
        if (projects) this._currentProjects = projects;
        if (this._panel) {
            this._close();
        } else {
            this._open();
        }
    }
 
    /** 
     * Force-open with a list of projects for the "Server Switcher" dashboard.
     */
    public open(projects: ProjectInfo[]): void {
        this._currentProjects = projects;
        if (this._panel) {
            // Panel already open. Update the project list if needed.
            this._panel.webview.postMessage({ type: 'updateProjects', projects: this._currentProjects });
            this._panel.reveal(vscode.ViewColumn.Beside, true);
        } else {
            this._open();
        }
    }
 
    /** Navigate to a new URL without toggling */
    public navigate(url: string): void {
        if (this._panel) {
            this._panel.webview.postMessage({ type: 'navigate', url });
        }
    }
 
    private _open(): void {
        this._panel = vscode.window.createWebviewPanel(
            'amypoBrowser',
            '⚡ Amypo Browser',
            { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this._extensionUri],
            }
        );
 
        // Initial URL is the first project, or localhost:3000
        const initialUrl = this._currentProjects && this._currentProjects.length > 0 && this._currentProjects[0].port > 0
            ? `http://localhost:${this._currentProjects[0].port}` 
            : 'http://localhost:5500';
 
        this._panel.webview.html = getBrowserTemplate(
            this._panel.webview,
            this._extensionUri,
            initialUrl,
            this._currentProjects
        );
 
        this._panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'pin':
                    await vscode.commands.executeCommand('workbench.action.pinEditor');
                    break;
                case 'openExternal':
                    if (message.url) {
                        await vscode.env.openExternal(vscode.Uri.parse(message.url));
                    }
                    break;
            }
        });
 
        this._panel.onDidDispose(() => {
            this._panel = undefined;
            vscode.commands.executeCommand('setContext', 'amypo.browserOpen', false);
            this._onStatusChange.fire();
        });
 
        this._panel.onDidChangeViewState(({ webviewPanel }) => {
            vscode.commands.executeCommand('setContext', 'amypo.browserOpen', webviewPanel.visible);
            this._onStatusChange.fire();
        });
 
        vscode.commands.executeCommand('setContext', 'amypo.browserOpen', true);
        this._onStatusChange.fire();
    }
 
    private _close(): void {
        this._panel?.dispose();
        this._panel = undefined;
        vscode.commands.executeCommand('setContext', 'amypo.browserOpen', false);
        this._onStatusChange.fire();
    }
    
    public dispose(): void {
        this._close();
        this._terminals.forEach(t => t.dispose());
        this._terminals.clear();
        this._terminalDataListener?.dispose();
        this._onStatusChange.dispose(); // ✅ Add this
        PreviewManager._instance = undefined;
    }
}
