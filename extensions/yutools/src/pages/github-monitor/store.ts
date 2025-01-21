/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { create } from 'zustand';
import { getRepository, getCommits, getReadme } from './services/github-api';
import { parseGitHubUrl } from './utils/github-url';
import { addToHistory } from './db';

interface Repo {
  owner: string;
  name: string;
  commits: any[];
  readme: string;
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

interface GitHubStore {
  repos: Repo[];
  currentRepo: Repo | null;
  addRepo: (url: string) => Promise<void>;
  setCurrentRepo: (repo: Repo) => void;
  fetchCommits: (owner: string, name: string, page?: number, pageSize?: number) => Promise<void>;
  resetStore: () => void;
}

export const useGitHubStore = create<GitHubStore>((set, get) => ({
  repos: [],
  currentRepo: null,

  addRepo: async (url: string) => {
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      throw new Error('Invalid GitHub URL format. Please use: https://github.com/owner/repo');
    }

    const { owner, name } = parsed;

    try {
      await getRepository(owner, name);
      const commitsData = await getCommits(owner, name, 1, 20);
      const readme = await getReadme(owner, name);

      const newRepo = {
        owner,
        name,
        commits: commitsData.commits,
        readme,
        currentPage: commitsData.currentPage,
        totalCount: commitsData.totalCount,
        pageSize: 20
      };

      // Add to history
      await addToHistory(owner, name);

      set((state) => ({
        repos: [...state.repos, newRepo],
        currentRepo: newRepo,
      }));
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while accessing the repository.');
    }
  },

  setCurrentRepo: (repo) => {
    set({ currentRepo: repo });
  },

  fetchCommits: async (owner: string, name: string, page = 1, pageSize = 20) => {
    try {
      const commitsData = await getCommits(owner, name, page, pageSize);

      set((state) => {
        const updatedRepos = state.repos.map((repo) =>
          repo.owner === owner && repo.name === name
            ? {
              ...repo,
              commits: commitsData.commits,
              currentPage: commitsData.currentPage,
              totalCount: commitsData.totalCount,
              pageSize
            }
            : repo
        );

        const updatedCurrentRepo =
          state.currentRepo?.owner === owner && state.currentRepo?.name === name
            ? {
              ...state.currentRepo,
              commits: commitsData.commits,
              currentPage: commitsData.currentPage,
              totalCount: commitsData.totalCount,
              pageSize
            }
            : state.currentRepo;

        return {
          repos: updatedRepos,
          currentRepo: updatedCurrentRepo,
        };
      });
    } catch (error) {
      console.error('Failed to fetch commits:', error);
      throw error;
    }
  },

  resetStore: () => {
    set({ repos: [], currentRepo: null });
  },
}));
