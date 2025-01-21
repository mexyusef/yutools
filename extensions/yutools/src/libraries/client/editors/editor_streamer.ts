import * as vscode from 'vscode';

export class EditorStreamHandler {
  private position: vscode.Position;
  private previousPartialLine: string = '';
  private editor: vscode.TextEditor;
  private codeBlockState: {
    inBlock: boolean;
    fence: string;
  } = { inBlock: false, fence: '' };

  constructor(editor: vscode.TextEditor, startPosition?: vscode.Position) {
    this.editor = editor;
    this.position = startPosition || editor.selection.active;
  }

  public async handleChunk(chunk: string): Promise<void> {
    // Handle code block markers
    if (chunk.includes('```')) {
      this.codeBlockState.inBlock = !this.codeBlockState.inBlock;
      if (this.codeBlockState.inBlock) {
        this.codeBlockState.fence = '```';
      }
    }

    // Split by explicit newlines or paragraph breaks
    const lines = (this.previousPartialLine + chunk)
      .split(/(\n|```(?:[\s\S]*?)```)/g)
      .filter(line => line.length > 0);

    // Handle all but the last chunk
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i];
      await this.insertText(line);
      
      // Add newline if not already present and not in code block
      if (!line.endsWith('\n') && 
          !this.codeBlockState.inBlock && 
          i < lines.length - 1) {
        await this.insertText('\n');
      }
    }

    // Store the last chunk as partial line
    this.previousPartialLine = lines[lines.length - 1] || '';

    // Handle immediate newlines in the partial line
    if (this.previousPartialLine === '\n') {
      await this.insertText('\n');
      this.previousPartialLine = '';
    }
  }

  public async complete(): Promise<void> {
    if (this.previousPartialLine) {
      await this.insertText(this.previousPartialLine);
      if (!this.previousPartialLine.endsWith('\n')) {
        await this.insertText('\n');
      }
    }
  }

  private async insertText(text: string): Promise<void> {
    if (!text) return;

    await this.editor.edit(editBuilder => {
      editBuilder.insert(this.position, text);
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1];
      this.position = this.position.translate(
        lines.length - 1,
        lines.length === 1 ? text.length : lastLine.length
      );
    });
  }
}