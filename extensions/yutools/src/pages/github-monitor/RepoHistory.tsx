import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useGitHubStore } from './store';
import { removeFromHistory } from './db';

interface HistoryRepo {
  id?: number;
  owner: string;
  name: string;
  url: string;
  lastVisited: Date;
}

interface RepoHistoryProps {
  history: HistoryRepo[];
  onHistoryChange: () => void;
}

export function RepoHistory({ history, onHistoryChange }: RepoHistoryProps) {
  const addRepo = useGitHubStore((state) => state.addRepo);

  const handleRepoClick = async (url: string) => {
    try {
      await addRepo(url);
    } catch (error) {
      console.error('Failed to load repository:', error);
    }
  };

  const handleRemove = async (id: number) => {
    if (!id) return;
    try {
      await removeFromHistory(id);
      onHistoryChange();
    } catch (error) {
      console.error('Failed to remove from history:', error);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        No repository history yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((repo) => (
        <div
          key={repo.id}
          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Button
            variant="ghost"
            className="flex-1 justify-start text-left"
            onClick={() => handleRepoClick(repo.url)}
          >
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            {repo.owner}/{repo.name}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            onClick={() => handleRemove(repo.id!)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
