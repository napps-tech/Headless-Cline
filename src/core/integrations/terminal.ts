import { Terminal } from "vscode";
import { EventEmitter } from "events";

export interface TerminalInfo {
	id: number;
	terminal: Terminal;
	lastCommand: string;
}

export interface TerminalProcessResultPromise extends Promise<void> {
	on(event: "line", listener: (line: string) => void): this;
	on(event: "completed", listener: () => void): this;
	on(event: "no_shell_integration", listener: () => void): this;
	once(event: "completed", listener: () => void): this;
	once(event: "no_shell_integration", listener: () => void): this;
	continue(): void;
}

export interface TerminalManager {
	runCommand(terminalInfo: TerminalInfo, command: string): TerminalProcessResultPromise;
	getOrCreateTerminal(cwd: string): Promise<TerminalInfo>;
	getTerminals(busy: boolean): { id: number; lastCommand: string }[];
	getUnretrievedOutput(terminalId: number): string;
	isProcessHot(terminalId: number): boolean;
	disposeAll(): void;
} 