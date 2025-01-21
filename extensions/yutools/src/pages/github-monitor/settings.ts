/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  commitsPerPage: number;
  setCommitsPerPage: (value: number) => void;
}

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      commitsPerPage: 20,
      setCommitsPerPage: (value) => set({ commitsPerPage: value }),
    }),
    {
      name: 'github-monitor-settings',
    }
  )
);
