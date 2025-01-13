export interface DiffViewProvider {
	editType?: "create" | "modify";
	isEditing: boolean;
	originalContent?: string;

	open(relPath: string): Promise<void>;
	update(newContent: string, isComplete: boolean): Promise<void>;
	saveChanges(): Promise<{
		newProblemsMessage: string | undefined;
		userEdits: string | undefined;
		finalContent: string | undefined;
	}>;
	revertChanges(): Promise<void>;
	scrollToFirstDiff(): void;
	reset(): Promise<void>;
} 