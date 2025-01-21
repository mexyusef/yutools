/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { openDB, DBSchema } from 'idb';

export interface PresetRepo {
  id?: number;
  name: string;
  url: string;
  createdAt: Date;
}

interface HistoryRepo {
  id?: number;
  owner: string;
  name: string;
  url: string;
  lastVisited: Date;
}

interface GitHubMonitorDB extends DBSchema {
  'preset-repos': {
    key: number;
    value: PresetRepo;
    indexes: { 'by-url': string };
  };
  'history-repos': {
    key: number;
    value: HistoryRepo;
    indexes: { 'by-url': string };
  };
}

const dbPromise = openDB<GitHubMonitorDB>('github-monitor', 2, {
  upgrade(db, oldVersion, newVersion) {
    if (oldVersion < 1) {
      const presetStore = db.createObjectStore('preset-repos', {
        keyPath: 'id',
        autoIncrement: true,
      });
      presetStore.createIndex('by-url', 'url', { unique: true });

      // Add default presets
      const defaultPresets = [
        { name: 'React', url: 'https://github.com/facebook/react' },
        { name: 'NextUI', url: 'https://github.com/nextui-org/nextui' },
        { name: 'Quivr', url: 'https://github.com/QuivrHQ/quivr' },
        { name: 'Cofounder AI', url: 'https://github.com/raidendotai/cofounder' },
        { name: 'cline', url: 'https://github.com/cline/cline' },
        { name: 'aider', url: 'https://github.com/Aider-AI/aider' },
        { name: 'bolt.new', url: 'https://github.com/stackblitz/bolt.new' },
        { name: 'bolt.youtube', url: 'https://github.com/coleam00/bolt.new-any-llm' },
      ];

      defaultPresets.forEach(preset => {
        presetStore.add({
          ...preset,
          createdAt: new Date()
        });
      });
    }

    if (oldVersion < 2) {
      const historyStore = db.createObjectStore('history-repos', {
        keyPath: 'id',
        autoIncrement: true,
      });
      historyStore.createIndex('by-url', 'url', { unique: true });
    }
  },
});

export async function getAllPresets(): Promise<PresetRepo[]> {
  const db = await dbPromise;
  return db.getAll('preset-repos');
}

export async function addPreset(name: string, url: string): Promise<PresetRepo> {
  const db = await dbPromise;
  try {
    const id = await db.add('preset-repos', {
      name,
      url,
      createdAt: new Date()
    });
    return db.get('preset-repos', id) as Promise<PresetRepo>;
  } catch (error) {
    if (error instanceof Error && error.name === 'ConstraintError') {
      throw new Error('Repository URL already exists in presets');
    }
    throw error;
  }
}

export async function removePreset(id: number): Promise<void> {
  const db = await dbPromise;
  await db.delete('preset-repos', id);
}

export async function getAllHistory(): Promise<HistoryRepo[]> {
  const db = await dbPromise;
  const history = await db.getAll('history-repos');
  return history.sort((a, b) => b.lastVisited.getTime() - a.lastVisited.getTime());
}

export async function addToHistory(owner: string, name: string): Promise<void> {
  const db = await dbPromise;
  const url = `https://github.com/${owner}/${name}`;

  try {
    const existingEntry = await db.getFromIndex('history-repos', 'by-url', url);
    if (existingEntry) {
      await db.put('history-repos', {
        ...existingEntry,
        lastVisited: new Date()
      });
    } else {
      await db.add('history-repos', {
        owner,
        name,
        url,
        lastVisited: new Date()
      });
    }
  } catch (error) {
    console.error('Failed to add to history:', error);
  }
}

export async function removeFromHistory(id: number): Promise<void> {
  const db = await dbPromise;
  await db.delete('history-repos', id);
}
