/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function parseGitHubUrl(url: string): { owner: string; name: string } | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;

    const parts = urlObj.pathname.replace(/^\/|\/$/g, '').split('/');
    if (parts.length < 2) return null;

    return {
      owner: parts[0],
      name: parts[1].replace('.git', '')
    };
  } catch {
    return null;
  }
}
