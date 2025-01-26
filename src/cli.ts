#!/usr/bin/env node
import { Cline } from './core/Cline'
import { UrlContentFetcher } from './core/integrations/browser'
import { TerminalManager } from './core/integrations/terminal'
import { BrowserSession } from './core/integrations/browser'
import { DiffViewProvider } from './core/integrations/editor'
import { ShellProvider } from './core/integrations/platform'
import { ClineProvider } from './core/webview/type'
import { ExtensionMessage, BrowserActionResult } from './shared/ExtensionMessage'
import { HistoryItem } from './shared/HistoryItem'
import { ApiConfiguration, ApiProvider } from './shared/api'
import { ApiConfigMeta } from './shared/ExtensionMessage'
import { Anthropic } from '@anthropic-ai/sdk'
import fs from 'fs/promises'
import path from 'path'

// CLI用の簡易実装
class CliUrlContentFetcher implements UrlContentFetcher {
    async launchBrowser(): Promise<void> { }
    async closeBrowser(): Promise<void> { }
    async urlToMarkdown(url: string): Promise<string> {
        return `Content from ${url}`
    }
}

class CliBrowserSession implements BrowserSession {
    async launchBrowser(): Promise<void> { }
    async closeBrowser(): Promise<BrowserActionResult> {
        return { logs: '', screenshot: undefined }
    }
    async navigateToUrl(url: string): Promise<BrowserActionResult> {
        return { logs: '', screenshot: undefined }
    }
    async click(coordinate: string): Promise<BrowserActionResult> {
        return { logs: '', screenshot: undefined }
    }
    async type(text: string): Promise<BrowserActionResult> {
        return { logs: '', screenshot: undefined }
    }
    async scrollDown(): Promise<BrowserActionResult> {
        return { logs: '', screenshot: undefined }
    }
    async scrollUp(): Promise<BrowserActionResult> {
        return { logs: '', screenshot: undefined }
    }
}

class CliTerminalManager implements TerminalManager {
    async getOrCreateTerminal(cwd: string): Promise<any> {
        return { terminal: null, id: 0 }
    }
    runCommand(terminalInfo: any, command: string): any {
        console.log(`Executing command: ${command}`)
        return Promise.resolve()
    }
    getTerminals(busy: boolean): Array<{ id: number; lastCommand: string }> {
        return []
    }
    getUnretrievedOutput(terminalId: number): string {
        return ''
    }
    isProcessHot(terminalId: number): boolean {
        return false
    }
    disposeAll(): void { }
}

class CliDiffViewProvider implements DiffViewProvider {
    isEditing: boolean = false
    editType?: 'create' | 'modify'
    originalContent?: string

    async open(relPath: string): Promise<void> { }
    async update(content: string, complete: boolean): Promise<void> { }
    async revertChanges(): Promise<void> { }
    async saveChanges(): Promise<{
        newProblemsMessage: string | undefined
        userEdits: string | undefined
        finalContent: string | undefined
    }> {
        return {
            newProblemsMessage: undefined,
            userEdits: undefined,
            finalContent: undefined
        }
    }
    scrollToFirstDiff(): void { }
    reset(): Promise<void> {
        return Promise.resolve()
    }
}

class CliProvider implements ClineProvider {
    private globalStoragePath: string

    constructor() {
        this.globalStoragePath = path.join(process.cwd(), '.cline')
    }

    async postStateToWebview(): Promise<void> {
        return
    }

    async postMessageToWebview(message: ExtensionMessage): Promise<void> {
        return
    }

    async getState() {
        return {
            apiConfiguration: {
                apiProvider: 'anthropic' as ApiProvider,
                apiKey: process.env.ANTHROPIC_API_KEY,
            } as ApiConfiguration,
            lastShownAnnouncementId: undefined,
            customInstructions: undefined,
            alwaysAllowReadOnly: true,
            alwaysAllowWrite: true,
            alwaysAllowExecute: true,
            alwaysAllowBrowser: true,
            alwaysAllowMcp: true,
            taskHistory: [],
            allowedCommands: [],
            soundEnabled: false,
            diffEnabled: false,
            soundVolume: 1,
            browserViewportSize: '1280x720',
            screenshotQuality: 80,
            fuzzyMatchThreshold: 0.8,
            writeDelayMs: 0,
            terminalOutputLineLimit: 1000,
            preferredLanguage: 'en',
            mcpEnabled: false,
            alwaysApproveResubmit: false,
            requestDelaySeconds: 5,
            currentApiConfigName: 'default',
            listApiConfigMeta: [] as ApiConfigMeta[],
        }
    }

    async updateTaskHistory(item: HistoryItem): Promise<HistoryItem[]> {
        return []
    }

    async getTaskWithId(id: string) {
        return {
            historyItem: {} as HistoryItem,
            taskDirPath: '',
            apiConversationHistoryFilePath: '',
            uiMessagesFilePath: '',
            apiConversationHistory: [] as Anthropic.MessageParam[],
        }
    }

    async initClineWithHistoryItem(historyItem: HistoryItem): Promise<void> {
        return
    }

    getGlobalStoragePath(): string | undefined {
        return this.globalStoragePath
    }
}

async function main() {
    const args = process.argv.slice(2)
    const docIndex = args.indexOf('-d')

    if (docIndex === -1 || !args[docIndex + 1]) {
        console.error('Usage: npm run cline -d <document.md>')
        process.exit(1)
    }

    const docPath = args[docIndex + 1]

    try {
        const content = await fs.readFile(path.resolve(process.cwd(), docPath), 'utf-8')

        const provider = new CliProvider()
        const urlContentFetcher = new CliUrlContentFetcher()
        const terminalManager = new CliTerminalManager()
        const browserSession = new CliBrowserSession()
        const diffViewProvider = new CliDiffViewProvider()
        const shellProvider = new ShellProvider()

        const cline = new Cline(
            provider,
            urlContentFetcher,
            terminalManager,
            browserSession,
            diffViewProvider,
            shellProvider,
            {
                apiProvider: 'anthropic',
                apiKey: process.env.ANTHROPIC_API_KEY,
            },
            undefined,
            false,
            undefined,
            content
        )

        // タスクの完了を待機
        await new Promise<void>((resolve) => {
            setTimeout(resolve, 1000) // 一時的な実装
        })

    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

main()