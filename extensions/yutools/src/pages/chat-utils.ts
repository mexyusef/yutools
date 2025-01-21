/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { format } from 'date-fns';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
};

export type ChatResponse = {
  content: string;
};


export function exportChatToMarkdown(messages: Message[]): string {
  const header = `# Chat Conversation\n\nExported on: ${format(new Date(), 'PPpp')}\n\n---\n\n`;

  const content = messages.map(msg => {
    const timestamp = format(msg.timestamp, 'HH:mm:ss');
    const sender = msg.sender === 'user' ? '👤 User' : '🤖 Assistant';
    return `### ${sender} (${timestamp})\n\n${msg.content}\n\n---\n`;
  }).join('\n');

  return header + content;
}

export function importChatFromMarkdown(markdown: string): Message[] {
  const messages: Message[] = [];
  const sections = markdown.split('---\n').filter(Boolean);

  // Skip header section
  sections.slice(1).forEach(section => {
    const headerMatch = section.match(/### (👤 User|🤖 Assistant) \((\d{2}:\d{2}:\d{2})\)/);
    if (headerMatch) {
      const sender = headerMatch[1].includes('User') ? 'user' : 'system';
      const timeStr = headerMatch[2];
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);

      const timestamp = new Date();
      timestamp.setHours(hours, minutes, seconds);

      const content = section
        .replace(headerMatch[0], '')
        .trim();

      messages.push({
        id: crypto.randomUUID(),
        content,
        sender,
        timestamp,
      });
    }
  });

  return messages;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
