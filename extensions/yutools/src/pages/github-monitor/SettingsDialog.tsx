import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { useSettingsStore } from './settings';

const COMMITS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export function SettingsDialog() {
  const { commitsPerPage, setCommitsPerPage } = useSettingsStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Commits per page</label>
            <select
              value={commitsPerPage}
              onChange={(e) => setCommitsPerPage(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {COMMITS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} commits
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Note: GitHub API limits the total number of commits to 1000 per repository
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
