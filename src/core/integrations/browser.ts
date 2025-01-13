import { BrowserActionResult } from "../../shared/ExtensionMessage"

export interface BrowserSession {
	launchBrowser(): Promise<void>;
	closeBrowser(): Promise<BrowserActionResult>;
	navigateToUrl(url: string): Promise<BrowserActionResult>;
	click(coordinate: string): Promise<BrowserActionResult>;
	type(text: string): Promise<BrowserActionResult>;
	scrollDown(): Promise<BrowserActionResult>;
	scrollUp(): Promise<BrowserActionResult>;
}

export interface UrlContentFetcher {
	launchBrowser(): Promise<void>;
	closeBrowser(): Promise<void>;
	urlToMarkdown(url: string): Promise<string>;
} 