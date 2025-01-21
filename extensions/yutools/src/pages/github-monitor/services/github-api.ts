/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { apiClient, fetchWithRetry } from './api-client';

interface GitHubError extends Error {
  status?: number;
  response?: {
    status: number;
    data: any;
  };
}

export async function getRepository(owner: string, repo: string) {
  try {
    const response = await fetchWithRetry(() =>
      apiClient.get(`/repos/${owner}/${repo}`)
    );
    return response.data;
  } catch (error: any) {
    throw handleGitHubError(error, owner, repo);
  }
}

export async function getCommits(
  owner: string,
  repo: string,
  page = 1,
  perPage = 20
) {
  try {
    const response = await fetchWithRetry(() =>
      apiClient.get(`/repos/${owner}/${repo}/commits`, {
        params: {
          page,
          per_page: perPage,
        }
      })
    );

    // GitHub API has a limit of 1000 commits
    const totalCount = Math.min(
      parseInt(response.headers['x-total-count'] || '0'),
      1000
    );

    return {
      commits: response.data,
      totalCount,
      currentPage: page,
    };
  } catch (error: any) {
    console.error('Failed to fetch commits:', error);
    throw handleGitHubError(error, owner, repo);
  }
}

export async function getIssues(owner: string, repo: string) {
  try {
    const response = await fetchWithRetry(() =>
      apiClient.get(`/repos/${owner}/${repo}/issues`, {
        params: {
          state: 'all',
          per_page: 100,
        }
      })
    );
    return response.data;
  } catch (error: any) {
    throw handleGitHubError(error, owner, repo);
  }
}

export async function getPullRequests(owner: string, repo: string) {
  try {
    const response = await fetchWithRetry(() =>
      apiClient.get(`/repos/${owner}/${repo}/pulls`, {
        params: {
          state: 'all',
          per_page: 100,
        }
      })
    );
    return response.data;
  } catch (error: any) {
    throw handleGitHubError(error, owner, repo);
  }
}

export async function getReadme(owner: string, repo: string) {
  try {
    const response = await fetchWithRetry(() =>
      apiClient.get(`/repos/${owner}/${repo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      })
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return '# No README found\n\nThis repository does not have a README file.';
    }
    throw handleGitHubError(error, owner, repo);
  }
}

function handleGitHubError(error: any, owner: string, repo: string): GitHubError {
  const errorMessage = getErrorMessage(error, owner, repo);
  const githubError = new Error(errorMessage) as GitHubError;
  githubError.status = error.response?.status;
  return githubError;
}

function getErrorMessage(error: any, owner: string, repo: string): string {
  if (!error.response) {
    return 'Network error. Please check your internet connection and try again.';
  }

  const status = error.response.status;
  const messages: Record<number, string> = {
    404: `Repository not found: ${owner}/${repo}`,
    403: 'API rate limit exceeded. Please try again later.',
    500: 'GitHub servers are experiencing issues. Please try again in a few minutes.',
    502: 'GitHub service is temporarily unavailable. Please try again later.',
    503: 'GitHub service is temporarily unavailable. Please try again later.',
    504: 'GitHub service is temporarily unavailable. Please try again later.'
  };

  return messages[status] || 'Failed to access repository. Please verify it exists and is public.';
}
