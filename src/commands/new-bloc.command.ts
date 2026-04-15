import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pascalCase } from 'change-case';
import { blocTemplate, blocEventTemplate, blocStateTemplate } from '../templates';
import { updateBarrelFile, findPubspecDir, hasBuildRunner, runBuildRunner } from '../utils';

const SNAKE_CASE_REGEX = /^[a-z][a-z0-9_]*$/;

export async function newBlocCommand(uri: vscode.Uri | undefined): Promise<void> {
  const targetDir = getTargetDir(uri);
  if (!targetDir) {
    vscode.window.showErrorMessage('Select a folder in the explorer to create a BLoC.');
    return;
  }

  const name = await vscode.window.showInputBox({
    prompt: 'Enter the BLoC name in snake_case (e.g. user_login)',
    validateInput: (value: string) => validateName(value, targetDir),
  });

  if (!name) {
    return;
  }

  const pascal = pascalCase(name);
  const blocDir = path.join(targetDir, name);

  try {
    fs.mkdirSync(blocDir, { recursive: true });

    fs.writeFileSync(path.join(blocDir, `${name}_bloc.dart`), blocTemplate(name, pascal));
    fs.writeFileSync(path.join(blocDir, `${name}_event.dart`), blocEventTemplate(name, pascal));
    fs.writeFileSync(path.join(blocDir, `${name}_state.dart`), blocStateTemplate(name, pascal));

    updateBarrelFile(targetDir, name);

    const config = vscode.workspace.getConfiguration('wlmaker');
    if (config.get<boolean>('autoRunBuildRunner', true)) {
      const projectRoot = findPubspecDir(targetDir);
      if (projectRoot && hasBuildRunner(projectRoot)) {
        await runBuildRunner(projectRoot);
      } else {
        vscode.window.showInformationMessage(`BLoC "${pascal}Bloc" created successfully.`);
      }
    } else {
      vscode.window.showInformationMessage(`BLoC "${pascal}Bloc" created successfully.`);
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create BLoC: ${error}`);
  }
}

function getTargetDir(uri: vscode.Uri | undefined): string | undefined {
  if (uri && fs.statSync(uri.fsPath).isDirectory()) {
    return uri.fsPath;
  }
  if (uri) {
    return path.dirname(uri.fsPath);
  }
  return undefined;
}

function validateName(name: string, targetDir: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return 'Name cannot be empty.';
  }
  if (!SNAKE_CASE_REGEX.test(name)) {
    return 'Name must be snake_case (lowercase letters, digits, underscores).';
  }
  if (fs.existsSync(path.join(targetDir, name))) {
    return `Directory "${name}" already exists.`;
  }
  return undefined;
}
