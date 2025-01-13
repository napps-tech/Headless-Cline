import * as vscode from "vscode"
import * as path from "path"

export interface PlatformProvider {
  showWarningMessage(message: string, ...args: any[]): Thenable<string | undefined>
  openExternal(url: string): Thenable<boolean>
  getVisibleFiles(): Promise<string[]>
  getOpenTabs(): Promise<string[]>
  getWorkingDirectory(): string
}

export class ShellProvider implements PlatformProvider {
  showWarningMessage(message: string, ...args: any[]): Thenable<string | undefined> {
    return Promise.resolve(undefined)
  }
  openExternal(url: string): Thenable<boolean> {
    return Promise.resolve(true)
  }
  getVisibleFiles(): Promise<string[]> {
    return Promise.resolve([])
  }
  getOpenTabs(): Promise<string[]> {
    return Promise.resolve([])
  }
  getWorkingDirectory(): string {
    return process.cwd()
  }
}

export class VSCodeProvider implements PlatformProvider {
  private cwd: string

  constructor(cwd: string) {
    this.cwd = cwd
  }

  showWarningMessage(message: string, ...args: any[]): Thenable<string | undefined> {
    return vscode.window.showWarningMessage(message, ...args)
  }
  openExternal(url: string): Thenable<boolean> {
    return vscode.env.openExternal(vscode.Uri.parse(url))
  }
  getVisibleFiles(): Promise<string[]> {
    return Promise.resolve(
      vscode.window.visibleTextEditors
        ?.map((editor) => editor.document?.uri?.fsPath)
        .filter(Boolean)
        .map((absolutePath) => path.relative(this.cwd, absolutePath).toPosix())
    )
  }
  getOpenTabs(): Promise<string[]> {
    return Promise.resolve(
      vscode.window.tabGroups.all
        .flatMap((group) => group.tabs)
        .map((tab) => (tab.input as vscode.TabInputText)?.uri?.fsPath)
        .filter(Boolean)
        .map((absolutePath) => path.relative(this.cwd, absolutePath).toPosix())
    )
  }
  getWorkingDirectory(): string {
    return this.cwd
  }
}