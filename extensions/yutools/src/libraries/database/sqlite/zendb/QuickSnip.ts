import * as vscode from 'vscode';
import { ZenDB } from './core/Database';
import { Table } from './core/Table';

interface QuickSnip {
  id?: number;
  title: string;
  content: string;
  timestamp: string;
  tags?: string;
}

export class QuickSnipManager {
  private db: ZenDB;
  private snippets: Table<QuickSnip>;

  constructor(dbPath: string) {
    this.db = new ZenDB(dbPath);
    this.snippets = this.db.table<QuickSnip>('snippets', {
      id: { type: 'integer', primaryKey: true, autoIncrement: true },
      title: { type: 'text', required: true },
      content: { type: 'text', required: true },
      timestamp: { type: 'text', required: true },
      tags: { type: 'text', required: false },
    });
  }

  async saveSnippet() {
    const content = await vscode.window.showInputBox({ prompt: 'Enter your snippet (link, note, etc.)' });
    if (content) {
      const timestamp = new Date().toISOString();
      const title = content.slice(0, 30); // Create title from first 30 chars of content
      this.snippets.insert({ title, content, timestamp });
      vscode.window.showInformationMessage('Snippet saved!');
    }
  }

  listSnippets() {
    const snippets = this.snippets.find().all();
    if (snippets.length > 0) {
      const items = snippets.map(snippet => {
        const data = snippet.toObject();
        return {
          label: data.title,
          detail: `Content: ${data.content}\nSaved on: ${data.timestamp}`,
        };
      });

      vscode.window.showQuickPick(items, { placeHolder: 'Select a snippet to copy' }).then(selected => {
        if (selected) {
          vscode.env.clipboard.writeText(selected.detail.split('\n')[0].split(': ')[1]); // Copy content to clipboard
          vscode.window.showInformationMessage('Snippet copied to clipboard!');
        }
      });
    } else {
      vscode.window.showInformationMessage('No snippets found.');
    }
  }

  searchSnippets(query: string) {
    const snippets = this.snippets.find().where({ content: { $like: `%${query}%` } }).all();
    if (snippets.length > 0) {
      const items = snippets.map(snippet => {
        const data = snippet.toObject();
        return {
          label: data.title,
          detail: `Content: ${data.content}\nSaved on: ${data.timestamp}`,
        };
      });

      vscode.window.showQuickPick(items, { placeHolder: 'Select a snippet to copy' }).then(selected => {
        if (selected) {
          vscode.env.clipboard.writeText(selected.detail.split('\n')[0].split(': ')[1]); // Copy content to clipboard
          vscode.window.showInformationMessage('Snippet copied to clipboard!');
        }
      });
    } else {
      vscode.window.showInformationMessage('No snippets found matching your query.');
    }
  }

  listSnippetsForDeletion(): { label: string; id: number }[] {
    const snippets = this.snippets.find().all();
    return snippets.map(snippet => {
      const data = snippet.toObject();
      return {
        label: data.title,
        id: data.id!,
      };
    });
  }

  deleteSnippet(id: number) {
    this.snippets.delete(id);
  }

  close() {
    this.db.close();
  }
}