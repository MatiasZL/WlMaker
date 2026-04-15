import * as vscode from 'vscode';
import { newBlocCommand } from './commands';

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('wlmaker.newBloc', newBlocCommand);
  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
