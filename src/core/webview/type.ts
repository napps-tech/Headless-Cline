import { Anthropic } from "@anthropic-ai/sdk"
import { ApiConfiguration, ModelInfo } from "../../shared/api"
import { ApiConfigMeta, ExtensionMessage } from "../../shared/ExtensionMessage"
import { HistoryItem } from "../../shared/HistoryItem"
import { ConfigManager } from "../config/ConfigManager"
import { McpHub } from "../../services/mcp/McpHub"
// import * as vscode from "vscode"

export interface ClineProvider {
  // readonly context: {
  //   extensionUri: any
  //   globalState: {
  //     get(key: string): Thenable<any>
  //     update(key: string, value: any): Thenable<void>
  //   }
  //   secrets: {
  //     get(key: string): Thenable<string | undefined>
  //     store(key: string, value: string): Thenable<void>
  //     delete(key: string): Thenable<void>
  //   }
  //   globalStorageUri: { fsPath: string }
  //   extension?: { packageJSON?: { version?: string } }
  // }
  // readonly context: vscode.ExtensionContext
  postStateToWebview(): Thenable<void>

  // readonly outputChannel: {
  //   appendLine(message: string): void
  // }
  // readonly configManager: ConfigManager
  readonly mcpHub?: McpHub

  // dispose(): Thenable<void>
  postMessageToWebview(message: ExtensionMessage): Thenable<void>
  getState(): Thenable<{
    apiConfiguration: ApiConfiguration
    lastShownAnnouncementId?: string
    customInstructions?: string
    alwaysAllowReadOnly: boolean
    alwaysAllowWrite: boolean
    alwaysAllowExecute: boolean
    alwaysAllowBrowser: boolean
    alwaysAllowMcp: boolean
    taskHistory?: HistoryItem[]
    allowedCommands?: string[]
    soundEnabled: boolean
    diffEnabled: boolean
    soundVolume?: number
    browserViewportSize: string
    screenshotQuality: number
    fuzzyMatchThreshold: number
    writeDelayMs: number
    terminalOutputLineLimit: number
    preferredLanguage: string
    mcpEnabled: boolean
    alwaysApproveResubmit: boolean
    requestDelaySeconds: number
    currentApiConfigName: string
    listApiConfigMeta: ApiConfigMeta[]
  }>
  updateTaskHistory(item: HistoryItem): Thenable<HistoryItem[]>
  getTaskWithId(id: string): Thenable<{
    historyItem: HistoryItem
    taskDirPath: string
    apiConversationHistoryFilePath: string
    uiMessagesFilePath: string
    apiConversationHistory: Anthropic.MessageParam[]
  }>
  initClineWithHistoryItem(historyItem: HistoryItem): Thenable<void>
  // clearTask(): Thenable<void>
  // refreshOpenRouterModels(): Thenable<Record<string, ModelInfo> | undefined>
  // refreshGlamaModels(): Thenable<Record<string, ModelInfo> | undefined>
  // ensureMcpServersDirectoryExists(): Thenable<string>
  // ensureSettingsDirectoryExists(): Thenable<string>
  // getOllamaModels(baseUrl?: string): Thenable<string[]>
  // getLmStudioModels(baseUrl?: string): Thenable<string[]>
  // getOpenAiModels(baseUrl?: string, apiKey?: string): Thenable<string[]>
  // handleOpenRouterCallback(code: string): Thenable<void>
  // updateCustomInstructions(instructions?: string): Thenable<void>
  // showTaskWithId(id: string): Thenable<void>
  // exportTaskWithId(id: string): Thenable<void>
  // deleteTaskWithId(id: string): Thenable<void>
  // resetState(): Thenable<void>

  getGlobalStoragePath(): string | undefined
} 