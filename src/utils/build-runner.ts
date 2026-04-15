import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function findPubspecDir(startDir: string): string | undefined {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'pubspec.yaml'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return undefined;
}

export function hasBuildRunner(projectRoot: string): boolean {
  const pubspec = fs.readFileSync(path.join(projectRoot, 'pubspec.yaml'), 'utf8');
  return /build_runner/.test(pubspec);
}

export function runBuildRunner(projectRoot: string): Promise<void> {
  return new Promise((resolve) => {
    const execution = new vscode.ShellExecution(
      'dart run build_runner build --delete-conflicting-outputs',
      { cwd: projectRoot },
    );
    const task = new vscode.Task(
      { type: 'wlmaker', label: 'build_runner' },
      vscode.TaskScope.Workspace,
      'Build Runner',
      'WlMaker',
      execution,
    );
    task.presentationOptions = {
      reveal: vscode.TaskRevealKind.Always,
      panel: vscode.TaskPanelKind.Shared,
    };

    const disposable = vscode.tasks.onDidEndTaskProcess((e) => {
      if (e.execution.task.definition.label === 'build_runner') {
        if (e.exitCode === 0) {
          vscode.window.showInformationMessage('build_runner completed successfully.');
        } else {
          vscode.window.showErrorMessage(`build_runner failed (exit code ${e.exitCode}).`);
        }
        disposable.dispose();
        resolve();
      }
    });

    vscode.tasks.executeTask(task);
  });
}
