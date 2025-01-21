import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface ColorTheme {
  added: string;
  removed: string;
  modified: string;
  name: string;
  description: string;
}

interface DiffConfig {
  colorTheme: string;
  fontSize: number;
  diffMode: 'line' | 'word';
  highContrast: boolean;
}

interface CompareHistory {
  leftPath: string;
  rightPath: string;
  timestamp: number;
  label?: string;
  notes?: string;
  tags?: string[];
}

interface DiffPair {
  leftPath: string;
  rightPath: string;
}

interface DirectoryCompareOptions {
  includeExtensions?: string[];
  excludeExtensions?: string[];
  excludePatterns?: string[];
  maxDepth?: number;
  ignoreWhitespace?: boolean;
}

interface BatchOperation {
  type: 'copy' | 'delete' | 'merge';
  files: string[];
  source: string;
  destination: string;
}

export class EasyDiff {

  private static readonly MAX_HISTORY = 10;
  private static history: CompareHistory[] = [];
  // Store context for history management
  // private 
  static context: vscode.ExtensionContext;
  private static config: DiffConfig = {
    colorTheme: 'soft',
    fontSize: 14,
    diffMode: 'line',
    highContrast: false
  };
  // Predefined color themes
  private static readonly colorThemes: { [key: string]: ColorTheme } = {
    soft: {
      added: 'rgba(40, 167, 69, 0.3)',
      removed: 'rgba(220, 53, 69, 0.3)',
      modified: 'rgba(255, 193, 7, 0.3)',
      name: 'Soft',
      description: 'Gentle colors easy on the eyes'
    },
    dark: {
      added: 'rgba(20, 100, 40, 0.4)',
      removed: 'rgba(150, 30, 40, 0.4)',
      modified: 'rgba(180, 130, 0, 0.4)',
      name: 'Dark',
      description: 'Darker shades for better contrast'
    },
    highContrast: {
      added: 'rgba(0, 255, 0, 0.3)',
      removed: 'rgba(255, 0, 0, 0.3)',
      modified: 'rgba(255, 255, 0, 0.3)',
      name: 'High Contrast',
      description: 'Maximum visibility with bright colors'
    },
    pastel: {
      added: 'rgba(170, 255, 170, 0.4)',
      removed: 'rgba(255, 170, 170, 0.4)',
      modified: 'rgba(255, 255, 170, 0.4)',
      name: 'Pastel',
      description: 'Soft pastel colors for a gentle view'
    },
    monochrome: {
      added: 'rgba(200, 200, 200, 0.4)',
      removed: 'rgba(100, 100, 100, 0.4)',
      modified: 'rgba(150, 150, 150, 0.4)',
      name: 'Monochrome',
      description: 'Grayscale theme for minimal distraction'
    }
  };

  private static addedDecoration: vscode.TextEditorDecorationType;
  private static removedDecoration: vscode.TextEditorDecorationType;
  private static modifiedDecoration: vscode.TextEditorDecorationType;

  private static lastDiffInfo: {
    leftContent: string;
    rightContent: string;
    leftLabel: string;
    rightLabel: string;
    leftUri: vscode.Uri;
    rightUri: vscode.Uri;
  } | null = null;

  /**
   * Load comparison history from global state
   */
  static initialize(context: vscode.ExtensionContext) {
    // Load configuration
    const config = vscode.workspace.getConfiguration('easyDiff');
    this.config = {
      colorTheme: config.get('colorTheme', this.config.colorTheme),
      fontSize: config.get('fontSize', this.config.fontSize),
      diffMode: config.get('diffMode', this.config.diffMode),
      highContrast: config.get('highContrast', this.config.highContrast)
    };

    this.updateDecorations();

    // Load history
    this.history = context.globalState.get<CompareHistory[]>('yutools.diff.easyDiff.history', []);
  }

  /**
   * Compare current editor content with clipboard
   */
  static async compareWithClipboard(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found!');
      return;
    }

    const clipboardContent = await vscode.env.clipboard.readText();
    if (!clipboardContent) {
      vscode.window.showWarningMessage('Clipboard is empty!');
      return;
    }

    await this.showEnhancedDiff(
      editor.document.getText(),
      clipboardContent,
      'Current Editor',
      'Clipboard'
    );
  }

  /**
   * Compare current editor with a selected file
   */
  static async compareWithFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found!');
      return;
    }

    const files = await vscode.window.showOpenDialog({
      canSelectMany: false,
      title: 'Select file to compare with'
    });

    if (!files || files.length === 0) return;

    const compareDoc = await vscode.workspace.openTextDocument(files[0]);
    await this.showEnhancedDiff(
      editor.document.getText(),
      compareDoc.getText(),
      'Current Editor',
      files[0].fsPath
    );
  }

  /**
   * Compare current selection with clipboard
   */
  static async compareSelectionWithClipboard(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found!');
      return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showWarningMessage('No text selected!');
      return;
    }

    const selectedText = editor.document.getText(selection);
    const clipboardContent = await vscode.env.clipboard.readText();

    await this.showEnhancedDiff(
      selectedText,
      clipboardContent,
      'Selection',
      'Clipboard'
    );
  }

  /**
   * Apply changes from right to left
   */
  static async applyChangesToLeft(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || !this.lastDiffInfo) {
      vscode.window.showWarningMessage('No active diff or editor found!');
      return;
    }

    const edit = new vscode.WorkspaceEdit();
    const document = activeEditor.document;

    // Replace entire content
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );

    edit.replace(document.uri, fullRange, this.lastDiffInfo.rightContent);
    await vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage('Changes applied to left side');
  }

  /**
   * Apply changes from left to right
   */
  static async applyChangesToRight(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || !this.lastDiffInfo) {
      vscode.window.showWarningMessage('No active diff or editor found!');
      return;
    }

    // If right side is a file, update it
    if (this.lastDiffInfo.rightUri.scheme === 'file') {
      const edit = new vscode.WorkspaceEdit();
      edit.createFile(this.lastDiffInfo.rightUri, { overwrite: true });
      edit.insert(
        this.lastDiffInfo.rightUri,
        new vscode.Position(0, 0),
        this.lastDiffInfo.leftContent
      );
      await vscode.workspace.applyEdit(edit);
      vscode.window.showInformationMessage('Changes applied to right side');
    }
  }

  private static updateDecorations(): void {
    const theme = this.colorThemes[this.config.colorTheme];

    // Dispose old decorations if they exist
    this.addedDecoration?.dispose();
    this.removedDecoration?.dispose();
    this.modifiedDecoration?.dispose();

    // Create new decorations with current theme
    // C:\ai\yuagent\extensions\yutools\node_modules\vscode\vscode.d.ts
    this.addedDecoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: theme.added,
      isWholeLine: this.config.diffMode === 'line',
      // fontSize: `${this.config.fontSize}px`,
      border: this.config.highContrast ? '1px solid green' : undefined
    });

    this.removedDecoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: theme.removed,
      isWholeLine: this.config.diffMode === 'line',
      // fontSize: `${this.config.fontSize}px`,
      border: this.config.highContrast ? '1px solid red' : undefined
    });

    this.modifiedDecoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: theme.modified,
      isWholeLine: this.config.diffMode === 'line',
      // fontSize: `${this.config.fontSize}px`,
      border: this.config.highContrast ? '1px solid yellow' : undefined
    });
  }

  /**
   * Change color theme
   */
  static async changeTheme(): Promise<void> {
    const themes = Object.entries(this.colorThemes).map(([id, theme]) => ({
      label: theme.name,
      description: theme.description,
      id
    }));

    const selected = await vscode.window.showQuickPick(themes, {
      placeHolder: 'Select color theme for diff view'
    });

    if (selected) {
      this.config.colorTheme = selected.id;
      await vscode.workspace.getConfiguration('easyDiff').update('colorTheme', selected.id, true);
      this.updateDecorations();
      // Refresh current diff if any
      if (this.lastDiffInfo) {
        await this.showEnhancedDiff(
          this.lastDiffInfo.leftContent,
          this.lastDiffInfo.rightContent,
          this.lastDiffInfo.leftLabel,
          this.lastDiffInfo.rightLabel
        );
      }
    }
  }

  /**
   * Toggle between line and word diff modes
   */
  static async toggleDiffMode(): Promise<void> {
    this.config.diffMode = this.config.diffMode === 'line' ? 'word' : 'line';
    await vscode.workspace.getConfiguration('easyDiff').update('diffMode', this.config.diffMode, true);
    this.updateDecorations();
    // Refresh current diff if any
    if (this.lastDiffInfo) {
      await this.showEnhancedDiff(
        this.lastDiffInfo.leftContent,
        this.lastDiffInfo.rightContent,
        this.lastDiffInfo.leftLabel,
        this.lastDiffInfo.rightLabel
      );
    }
  }

  /**
   * Apply custom decorations to highlight changes
   */
  private static applyDecorations(
    editor: vscode.TextEditor,
    leftContent: string,
    rightContent: string
  ): void {
    const addedRanges: vscode.Range[] = [];
    const removedRanges: vscode.Range[] = [];

    // Simple line-by-line diff
    const leftLines = leftContent.split('\n');
    const rightLines = rightContent.split('\n');

    for (let i = 0; i < Math.max(leftLines.length, rightLines.length); i++) {
      if (i < leftLines.length && i < rightLines.length) {
        if (leftLines[i] !== rightLines[i]) {
          removedRanges.push(new vscode.Range(i, 0, i, leftLines[i].length));
          addedRanges.push(new vscode.Range(i, 0, i, rightLines[i].length));
        }
      } else if (i < leftLines.length) {
        removedRanges.push(new vscode.Range(i, 0, i, leftLines[i].length));
      } else {
        addedRanges.push(new vscode.Range(i, 0, i, rightLines[i].length));
      }
    }

    editor.setDecorations(this.addedDecoration, addedRanges);
    editor.setDecorations(this.removedDecoration, removedRanges);
  }

  // Helper to create temporary files for diff
  private static async createTempFile(content: string, label: string): Promise<vscode.Uri> {
    const tempFile = vscode.Uri.parse(`untitled:${label}.txt`);
    const edit = new vscode.WorkspaceEdit();
    edit.createFile(tempFile, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    const doc = await vscode.workspace.openTextDocument(tempFile);
    const editor = await vscode.window.showTextDocument(doc);
    await editor.edit(editBuilder => {
      editBuilder.insert(new vscode.Position(0, 0), content);
    });

    return tempFile;
  }

  private static async showEnhancedDiff(
    leftContent: string,
    rightContent: string,
    leftLabel: string,
    rightLabel: string
  ): Promise<void> {
    const leftUri = await this.createTempFile(leftContent, leftLabel);
    const rightUri = await this.createTempFile(rightContent, rightLabel);

    this.lastDiffInfo = {
      leftContent,
      rightContent,
      leftLabel,
      rightLabel,
      leftUri,
      rightUri
    };

    await vscode.commands.executeCommand('vscode.diff',
      leftUri,
      rightUri,
      `${leftLabel} ↔ ${rightLabel} (${this.config.diffMode} diff)`,
      { preview: true, preserveFocus: true }
    );

    const diffEditor = vscode.window.activeTextEditor;
    if (diffEditor) {
      if (this.config.diffMode === 'line') {
        this.applyLineDecorations(diffEditor, leftContent, rightContent);
      } else {
        this.applyWordDecorations(diffEditor, leftContent, rightContent);
      }
    }
  }

  private static applyLineDecorations(
    editor: vscode.TextEditor,
    leftContent: string,
    rightContent: string
  ): void {
    // Original line-by-line diff logic
    const addedRanges: vscode.Range[] = [];
    const removedRanges: vscode.Range[] = [];

    const leftLines = leftContent.split('\n');
    const rightLines = rightContent.split('\n');

    for (let i = 0; i < Math.max(leftLines.length, rightLines.length); i++) {
      if (i < leftLines.length && i < rightLines.length) {
        if (leftLines[i] !== rightLines[i]) {
          removedRanges.push(new vscode.Range(i, 0, i, leftLines[i].length));
          addedRanges.push(new vscode.Range(i, 0, i, rightLines[i].length));
        }
      } else if (i < leftLines.length) {
        removedRanges.push(new vscode.Range(i, 0, i, leftLines[i].length));
      } else {
        addedRanges.push(new vscode.Range(i, 0, i, rightLines[i].length));
      }
    }

    editor.setDecorations(this.addedDecoration, addedRanges);
    editor.setDecorations(this.removedDecoration, removedRanges);
  }

  private static applyWordDecorations(
    editor: vscode.TextEditor,
    leftContent: string,
    rightContent: string
  ): void {
    const addedRanges: vscode.Range[] = [];
    const removedRanges: vscode.Range[] = [];
    const modifiedRanges: vscode.Range[] = [];

    // Split into words and maintain position information
    const leftWords = this.getWordsWithPositions(leftContent);
    const rightWords = this.getWordsWithPositions(rightContent);

    let i = 0, j = 0;
    while (i < leftWords.length || j < rightWords.length) {
      if (i >= leftWords.length) {
        // Remaining words in right are added
        addedRanges.push(new vscode.Range(
          rightWords[j].startPos,
          rightWords[j].endPos
        ));
        j++;
      } else if (j >= rightWords.length) {
        // Remaining words in left are removed
        removedRanges.push(new vscode.Range(
          leftWords[i].startPos,
          leftWords[i].endPos
        ));
        i++;
      } else if (leftWords[i].text !== rightWords[j].text) {
        // Words differ - mark as modified
        modifiedRanges.push(new vscode.Range(
          leftWords[i].startPos,
          leftWords[i].endPos
        ));
        modifiedRanges.push(new vscode.Range(
          rightWords[j].startPos,
          rightWords[j].endPos
        ));
        i++;
        j++;
      } else {
        // Words match - skip
        i++;
        j++;
      }
    }

    editor.setDecorations(this.addedDecoration, addedRanges);
    editor.setDecorations(this.removedDecoration, removedRanges);
    editor.setDecorations(this.modifiedDecoration, modifiedRanges);
  }

  private static getWordsWithPositions(content: string): Array<{
    text: string;
    startPos: vscode.Position;
    endPos: vscode.Position;
  }> {
    const words: Array<{
      text: string;
      startPos: vscode.Position;
      endPos: vscode.Position;
    }> = [];

    let line = 0;
    let column = 0;
    let wordStart = 0;
    let currentWord = '';

    for (let i = 0; i < content.length; i++) {
      if (content[i] === '\n') {
        if (currentWord) {
          words.push({
            text: currentWord,
            startPos: new vscode.Position(line, wordStart),
            endPos: new vscode.Position(line, column)
          });
          currentWord = '';
        }
        line++;
        column = 0;
        wordStart = 0;
      } else if (/\s/.test(content[i])) {
        if (currentWord) {
          words.push({
            text: currentWord,
            startPos: new vscode.Position(line, wordStart),
            endPos: new vscode.Position(line, column)
          });
          currentWord = '';
        }
        column++;
        wordStart = column;
      } else {
        currentWord += content[i];
        column++;
      }
    }

    // Handle last word if any
    if (currentWord) {
      words.push({
        text: currentWord,
        startPos: new vscode.Position(line, wordStart),
        endPos: new vscode.Position(line, column)
      });
    }

    return words;
  }

  /**
   * Add comparison to history
   */
  private static async addToHistory(leftPath: string, rightPath: string, context: vscode.ExtensionContext): Promise<void> {
    const entry: CompareHistory = {
      leftPath,
      rightPath,
      timestamp: Date.now(),
      label: `${path.basename(leftPath)} ↔ ${path.basename(rightPath)}`
    };

    // Add to front, remove duplicates, keep only MAX_HISTORY items
    this.history = [
      entry,
      ...this.history.filter(h =>
        !(h.leftPath === leftPath && h.rightPath === rightPath)
      )
    ].slice(0, this.MAX_HISTORY);

    await context.globalState.update('yutools.diff.easyDiff.history', this.history);
  }

  /**
   * Show history and select files to compare
   */
  static async compareFromHistory(): Promise<void> {
    if (this.history.length === 0) {
      vscode.window.showInformationMessage('No comparison history available');
      return;
    }

    const selected = await vscode.window.showQuickPick(
      this.history.map(h => ({
        label: h.label || 'Unnamed comparison',
        description: new Date(h.timestamp).toLocaleString(),
        detail: `${h.leftPath} ↔ ${h.rightPath}`,
        history: h
      })),
      {
        placeHolder: 'Select previous comparison',
        title: 'Comparison History'
      }
    );

    if (selected) {
      await this.compareFiles(selected.history.leftPath, selected.history.rightPath);
    }
  }

  /**
   * Swap left and right files in current comparison
   */
  static async swapFiles(): Promise<void> {
    if (!this.lastDiffInfo?.leftContent || !this.lastDiffInfo?.rightContent) {
      vscode.window.showWarningMessage('No active comparison to swap');
      return;
    }

    await this.compareFiles(
      this.lastDiffInfo.rightContent,
      this.lastDiffInfo.leftContent
    );
  }

  /**
   * Compare directories with advanced options
   */
  static async compareDirectoriesAdvanced(): Promise<void> {
    // Get directories
    const leftDirs = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      title: 'Select first directory'
    });

    if (!leftDirs || leftDirs.length === 0) return;

    const rightDirs = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      title: 'Select second directory'
    });

    if (!rightDirs || rightDirs.length === 0) return;

    // Get comparison options
    const options = await this.getDirectoryCompareOptions();
    if (!options) return;

    const leftDir = leftDirs[0].fsPath;
    const rightDir = rightDirs[0].fsPath;

    // Find differences with options
    const differences = await this.findDirectoryDifferences(leftDir, rightDir, options);

    // Show differences and handle batch operations
    await this.showDirectoryDifferencesAdvanced(differences, leftDir, rightDir);
  }

  /**
   * Find differences between directories
   */
  // private static async findDirectoryDifferences(
  //   leftDir: string,
  //   rightDir: string
  // ): Promise<{
  //   added: string[];
  //   removed: string[];
  //   modified: string[];
  //   same: string[];
  // }> {
  //   const leftFiles = await this.getAllFiles(leftDir);
  //   const rightFiles = await this.getAllFiles(rightDir);

  //   const leftSet = new Set(leftFiles.map(f => path.relative(leftDir, f)));
  //   const rightSet = new Set(rightFiles.map(f => path.relative(rightDir, f)));

  //   const added = [...rightSet].filter(f => !leftSet.has(f));
  //   const removed = [...leftSet].filter(f => !rightSet.has(f));
  //   const common = [...leftSet].filter(f => rightSet.has(f));

  //   // Check content of common files
  //   const modified: string[] = [];
  //   const same: string[] = [];

  //   for (const file of common) {
  //     const leftContent = await fs.promises.readFile(path.join(leftDir, file), 'utf-8');
  //     const rightContent = await fs.promises.readFile(path.join(rightDir, file), 'utf-8');

  //     if (leftContent !== rightContent) {
  //       modified.push(file);
  //     } else {
  //       same.push(file);
  //     }
  //   }

  //   return { added, removed, modified, same };
  // }

  /**
   * Enhanced directory comparison with options
   */
  private static async findDirectoryDifferences(
    leftDir: string,
    rightDir: string,
    options: DirectoryCompareOptions
  ): Promise<{
    added: string[];
    removed: string[];
    modified: string[];
    same: string[];
  }> {
    const leftFiles = await this.getAllFiles(
      leftDir,
      // options
    );
    const rightFiles = await this.getAllFiles(
      rightDir,
      // options
    );

    const leftSet = new Set(leftFiles.map(f => path.relative(leftDir, f)));
    const rightSet = new Set(rightFiles.map(f => path.relative(rightDir, f)));

    const added = [...rightSet].filter(f => !leftSet.has(f));
    const removed = [...leftSet].filter(f => !rightSet.has(f));
    const common = [...leftSet].filter(f => rightSet.has(f));

    const modified: string[] = [];
    const same: string[] = [];

    for (const file of common) {
      let leftContent = await fs.promises.readFile(path.join(leftDir, file), 'utf-8');
      let rightContent = await fs.promises.readFile(path.join(rightDir, file), 'utf-8');

      if (options.ignoreWhitespace) {
        leftContent = leftContent.replace(/\s+/g, ' ').trim();
        rightContent = rightContent.replace(/\s+/g, ' ').trim();
      }

      if (leftContent !== rightContent) {
        modified.push(file);
      } else {
        same.push(file);
      }
    }

    return { added, removed, modified, same };
  }
  /**
   * Show directory differences in tree view
   */
  private static async showDirectoryDifferences(
    differences: {
      added: string[];
      removed: string[];
      modified: string[];
      same: string[];
    },
    leftDir: string,
    rightDir: string
  ): Promise<void> {
    const items: vscode.QuickPickItem[] = [
      { label: '$(diff-added) Added Files', kind: vscode.QuickPickItemKind.Separator },
      ...differences.added.map(f => ({
        label: f,
        description: 'Added',
        iconPath: 'diff-added' // Use the icon id directly
      })),
      { label: '$(diff-removed) Removed Files', kind: vscode.QuickPickItemKind.Separator },
      ...differences.removed.map(f => ({
        label: f,
        description: 'Removed',
        iconPath: 'diff-removed' // Use the icon id directly
      })),
      { label: '$(diff-modified) Modified Files', kind: vscode.QuickPickItemKind.Separator },
      ...differences.modified.map(f => ({
        label: f,
        description: 'Modified',
        iconPath: 'diff-modified' // Use the icon id directly
      }))
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select files to compare',
      title: `Comparing ${path.basename(leftDir)} ↔ ${path.basename(rightDir)}`,
      canPickMany: false
    });

    if (selected && selected.kind !== vscode.QuickPickItemKind.Separator) {
      const leftPath = path.join(leftDir, selected.label);
      const rightPath = path.join(rightDir, selected.label);

      // If file exists in both directories, compare them
      if (differences.modified.includes(selected.label)) {
        await this.compareFiles(leftPath, rightPath);
      }
      // If file only exists in one directory, show appropriate message
      else if (differences.added.includes(selected.label)) {
        vscode.window.showInformationMessage(`File ${selected.label} only exists in ${path.basename(rightDir)}`);
      } else if (differences.removed.includes(selected.label)) {
        vscode.window.showInformationMessage(`File ${selected.label} only exists in ${path.basename(leftDir)}`);
      }
    }
  }

  /**
   * Get all files in a directory recursively
   */
  private static async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    async function walk(currentDir: string) {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    }

    await walk(dir);
    return files;
  }

  /**
   * Compare two files with paths
   */
  private static async compareFiles(leftContent: string, rightContent: string): Promise<void> {
    try {
      const leftDoc = await vscode.workspace.openTextDocument(leftContent);
      const rightDoc = await vscode.workspace.openTextDocument(rightContent);

      await this.showEnhancedDiff(
        leftDoc.getText(),
        rightDoc.getText(),
        path.basename(leftContent),
        path.basename(rightContent)
      );

      this.lastDiffInfo = {
        ...this.lastDiffInfo!,
        leftContent,
        rightContent
      };

      // this.updateStatusBar();

      // Add to history
      await this.addToHistory(leftContent, rightContent, this.context);
    } catch (error) {
      vscode.window.showErrorMessage(`Error comparing files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  /**
   * Export comparison history
   */
  static async exportHistory(): Promise<void> {
    const historyJson = JSON.stringify(this.history, null, 2);

    const saveLocation = await vscode.window.showSaveDialog({
      filters: { 'JSON': ['json'] },
      defaultUri: vscode.Uri.file('diff-history.json')
    });

    if (saveLocation) {
      await fs.promises.writeFile(saveLocation.fsPath, historyJson);
      vscode.window.showInformationMessage('History exported successfully');
    }
  }

  /**
   * Import comparison history
   */
  static async importHistory(): Promise<void> {
    const fileLocation = await vscode.window.showOpenDialog({
      filters: { 'JSON': ['json'] },
      canSelectMany: false
    });

    if (fileLocation && fileLocation[0]) {
      try {
        const content = await fs.promises.readFile(fileLocation[0].fsPath, 'utf-8');
        const importedHistory = JSON.parse(content) as CompareHistory[];

        // Validate imported history
        if (Array.isArray(importedHistory) &&
          importedHistory.every(h => h.leftPath && h.rightPath && h.timestamp)) {

          const action = await vscode.window.showQuickPick(
            ['Merge with existing', 'Replace existing'],
            { placeHolder: 'How would you like to import?' }
          );

          if (action === 'Merge with existing') {
            this.history = [...importedHistory, ...this.history]
              .slice(0, this.MAX_HISTORY);
          } else if (action === 'Replace existing') {
            this.history = importedHistory.slice(0, this.MAX_HISTORY);
          }

          await this.context.globalState.update('yutools.diff.easyDiff.history', this.history);
          vscode.window.showInformationMessage('History imported successfully');
        }
      } catch (error) {
        vscode.window.showErrorMessage('Invalid history file format');
      }
    }
  }

  /**
   * Compare directories with advanced options
   */
  // static async compareDirectoriesAdvanced(): Promise<void> {
  //   // Get directories
  //   const leftDirs = await vscode.window.showOpenDialog({
  //     canSelectFiles: false,
  //     canSelectFolders: true,
  //     canSelectMany: false,
  //     title: 'Select first directory'
  //   });

  //   if (!leftDirs || leftDirs.length === 0) return;

  //   const rightDirs = await vscode.window.showOpenDialog({
  //     canSelectFiles: false,
  //     canSelectFolders: true,
  //     canSelectMany: false,
  //     title: 'Select second directory'
  //   });

  //   if (!rightDirs || rightDirs.length === 0) return;

  //   // Get comparison options
  //   const options = await this.getDirectoryCompareOptions();
  //   if (!options) return;

  //   const leftDir = leftDirs[0].fsPath;
  //   const rightDir = rightDirs[0].fsPath;

  //   // Find differences with options
  //   const differences = await this.findDirectoryDifferences(leftDir, rightDir, options);

  //   // Show differences and handle batch operations
  //   await this.showDirectoryDifferencesAdvanced(differences, leftDir, rightDir);
  // }

  /**
   * Get directory comparison options through UI
   */
  private static async getDirectoryCompareOptions(): Promise<DirectoryCompareOptions | undefined> {
    const options: DirectoryCompareOptions = {};

    const includeExtensions = await vscode.window.showInputBox({
      prompt: 'File extensions to include (comma-separated, leave empty for all)',
      placeHolder: 'Example: .ts,.js,.json'
    });

    if (includeExtensions === undefined) return undefined;
    if (includeExtensions) {
      options.includeExtensions = includeExtensions.split(',').map(e => e.trim());
    }

    const excludeExtensions = await vscode.window.showInputBox({
      prompt: 'File extensions to exclude (comma-separated)',
      placeHolder: 'Example: .git,.DS_Store'
    });

    if (excludeExtensions === undefined) return undefined;
    if (excludeExtensions) {
      options.excludeExtensions = excludeExtensions.split(',').map(e => e.trim());
    }

    const excludePatterns = await vscode.window.showInputBox({
      prompt: 'Patterns to exclude (comma-separated)',
      placeHolder: 'Example: node_modules/**,dist/**'
    });

    if (excludePatterns === undefined) return undefined;
    if (excludePatterns) {
      options.excludePatterns = excludePatterns.split(',').map(p => p.trim());
    }

    const maxDepth = await vscode.window.showInputBox({
      prompt: 'Maximum directory depth (leave empty for unlimited)',
      placeHolder: 'Example: 3'
    });

    if (maxDepth === undefined) return undefined;
    if (maxDepth) {
      options.maxDepth = parseInt(maxDepth);
    }

    const ignoreWhitespace = await vscode.window.showQuickPick(
      ['Yes', 'No'],
      { placeHolder: 'Ignore whitespace differences?' }
    );

    if (ignoreWhitespace === undefined) return undefined;
    options.ignoreWhitespace = ignoreWhitespace === 'Yes';

    return options;
  }
  /**
   * Show directory differences with batch operations
   */
  private static async showDirectoryDifferencesAdvanced(
    differences: {
      added: string[];
      removed: string[];
      modified: string[];
      same: string[];
    },
    leftDir: string,
    rightDir: string
  ): Promise<void> {
    const treeData = [
      {
        label: '$(diff-added) Added Files',
        description: `(${differences.added.length})`,
        files: differences.added,
        type: 'added'
      },
      {
        label: '$(diff-removed) Removed Files',
        description: `(${differences.removed.length})`,
        files: differences.removed,
        type: 'removed'
      },
      {
        label: '$(diff-modified) Modified Files',
        description: `(${differences.modified.length})`,
        files: differences.modified,
        type: 'modified'
      }
    ];

    const items: (vscode.QuickPickItem & { type?: string })[] = treeData.flatMap(group => [
      {
        label: group.label,
        description: group.description,
        kind: vscode.QuickPickItemKind.Separator
      },
      ...group.files.map(f => ({
        label: f,
        description: group.type,
        detail: path.dirname(f),
        type: group.type
      }))
    ]);

    // Add batch operation options
    items.unshift(
      {
        label: '$(gear) Batch Operations',
        description: 'Deskripsi untuk batch operations',
        kind: vscode.QuickPickItemKind.Separator
      },
      {
        label: '$(sync) Sync All Modified Files',
        description: 'Copy all modified files from source to destination',
        detail: 'Batch Operation',
        type: 'batch-sync'
      },
      {
        label: '$(copy) Copy All New Files',
        description: 'Copy all new files from source to destination',
        detail: 'Batch Operation',
        type: 'batch-copy'
      },
      {
        label: '$(trash) Delete All Removed Files',
        description: 'Delete files that exist only in destination',
        detail: 'Batch Operation',
        type: 'batch-delete'
      }
    );

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select files to compare or choose batch operation',
      title: `Comparing ${path.basename(leftDir)} ↔ ${path.basename(rightDir)}`,
      canPickMany: false
    });

    if (!selected) return;

    if ('type' in selected && selected.type?.startsWith('batch-')) {
      await this.handleBatchOperation(
        selected.type,
        differences,
        leftDir,
        rightDir
      );
    } else if ('type' in selected && selected.type) {
      await this.handleSingleFile(
        selected.label,
        selected.type,
        leftDir,
        rightDir
      );
    }
  }

  /**
   * Handle batch operations
   */
  private static async handleBatchOperation(
    operationType: string,
    differences: {
      added: string[];
      removed: string[];
      modified: string[];
      same: string[];
    },
    leftDir: string,
    rightDir: string
  ): Promise<void> {
    const operation: BatchOperation = {
      type: 'copy',
      files: [],
      source: leftDir,
      destination: rightDir
    };

    switch (operationType) {
      case 'batch-sync':
        operation.type = 'merge';
        operation.files = differences.modified;
        break;
      case 'batch-copy':
        operation.type = 'copy';
        operation.files = differences.added;
        break;
      case 'batch-delete':
        operation.type = 'delete';
        operation.files = differences.removed;
        break;
    }

    const confirmation = await vscode.window.showWarningMessage(
      `Are you sure you want to ${operation.type} ${operation.files.length} files?`,
      'Yes',
      'No'
    );

    if (confirmation === 'Yes') {
      await this.executeBatchOperation(operation);
    }
  }

  /**
   * Execute batch operation
   */
  private static async executeBatchOperation(operation: BatchOperation): Promise<void> {
    const progress = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Executing ${operation.type} operation...`,
        cancellable: true
      },
      async (progress, token) => {
        let processed = 0;
        const total = operation.files.length;

        for (const file of operation.files) {
          if (token.isCancellationRequested) {
            break;
          }

          const sourcePath = path.join(operation.source, file);
          const destPath = path.join(operation.destination, file);

          try {
            switch (operation.type) {
              case 'copy':
              case 'merge':
                await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
                await fs.promises.copyFile(sourcePath, destPath);
                break;
              case 'delete':
                await fs.promises.unlink(destPath);
                break;
            }

            processed++;
            progress.report({
              message: `${processed}/${total} files processed`,
              increment: (100 / total)
            });
          } catch (error) {
            console.error(`Error processing ${file}:`, error);
          }
        }

        return processed;
      }
    );

    vscode.window.showInformationMessage(
      `Batch operation completed: ${progress}/${operation.files.length} files processed`
    );
  }

  /**
   * Handle single file comparison/operation
   */
  private static async handleSingleFile(
    file: string,
    type: string,
    leftDir: string,
    rightDir: string
  ): Promise<void> {
    const leftPath = path.join(leftDir, file);
    const rightPath = path.join(rightDir, file);

    if (type === 'modified') {
      await this.compareFiles(leftPath, rightPath);
    } else {
      const message = type === 'added' ?
        `File ${file} only exists in ${path.basename(rightDir)}` :
        `File ${file} only exists in ${path.basename(leftDir)}`;

      const action = await vscode.window.showWarningMessage(
        message,
        'Copy to Other Side',
        'Delete',
        'Cancel'
      );

      if (action === 'Copy to Other Side') {
        const targetPath = type === 'added' ? leftPath : rightPath;
        const sourcePath = type === 'added' ? rightPath : leftPath;

        await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.promises.copyFile(sourcePath, targetPath);
        vscode.window.showInformationMessage('File copied successfully');
      } else if (action === 'Delete') {
        const pathToDelete = type === 'added' ? rightPath : leftPath;
        await fs.promises.unlink(pathToDelete);
        vscode.window.showInformationMessage('File deleted successfully');
      }
    }
  }

}

// 3. Decorations (inline highlighting)
const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'rgba(255, 0, 0, 0.2)',
  border: '1px solid red'
});

export function register_easy_diff_commands(context: vscode.ExtensionContext) {

  // Store context for history management
  EasyDiff.context = context;

  // Initialize
  EasyDiff.initialize(context);

  context.subscriptions.push(

    vscode.commands.registerCommand('yutools.diff.easyDiff.compareWithClipboard', () => {
      EasyDiff.compareWithClipboard();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.compareWithFile', () => {
      EasyDiff.compareWithFile();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.compareSelectionWithClipboard', () => {
      EasyDiff.compareSelectionWithClipboard();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.applyChangesToLeft', () => {
      EasyDiff.applyChangesToLeft();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.applyChangesToRight', () => {
      EasyDiff.applyChangesToRight();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.compareFromHistory', () => {
      EasyDiff.compareFromHistory();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.swapFiles', () => {
      EasyDiff.swapFiles();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.compareDirectories', () => {
      EasyDiff.compareDirectoriesAdvanced();
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.exportHistory', () => {
      EasyDiff.exportHistory();
    }),

    vscode.languages.registerDocumentHighlightProvider('javascript', {
      provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position): vscode.DocumentHighlight[] {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const highlights: vscode.DocumentHighlight[] = [];

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          let index = -1;

          while ((index = line.text.indexOf(word, index + 1)) >= 0) {
            const range = new vscode.Range(i, index, i, index + word.length);
            highlights.push(new vscode.DocumentHighlight(range, vscode.DocumentHighlightKind.Read));
          }
        }

        return highlights;
      }
    }),

    vscode.languages.registerDocumentSymbolProvider('javascript', {
      provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        // Simple example: find function declarations
        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          if (line.text.includes('function')) {
            const range = line.range;
            symbols.push(
              new vscode.DocumentSymbol(
                'Function',
                'Function declaration',
                vscode.SymbolKind.Function,
                range,
                range
              )
            );
          }
        }

        return symbols;
      }
    }),

    vscode.commands.registerCommand('yutools.diff.easyDiff.highlightSelection', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const range = new vscode.Range(
          selection.start.line,
          selection.start.character,
          selection.end.line,
          selection.end.character
        );
        editor.setDecorations(decorationType, [range]);
      }
    }),

  )
}
