/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import axios from 'axios';

const BASE_URL = 'https://api.github.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'github-monitor-app',
  }
});

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export async function fetchWithRetry<T>(
  requestFn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    if (retries === 0 || !isRetryableError(error)) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, delay));

    return fetchWithRetry(
      requestFn,
      retries - 1,
      Math.min(delay * 2, 10000)
    );
  }
}

function isRetryableError(error: any): boolean {
  if (!error.response) return true; // Network errors are retryable
  const status = error.response.status;
  return status === 500 || status === 502 || status === 503 || status === 504;
}
