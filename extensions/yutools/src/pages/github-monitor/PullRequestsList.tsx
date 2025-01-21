import React, { useEffect, useState } from 'react';
import { getPullRequests } from './services/github-api';

interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  user: {
    login: string;
  };
}

interface PullRequestsListProps {
  owner: string;
  name: string;
}

export function PullRequestsList({ owner, name }: PullRequestsListProps) {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPullRequests = async () => {
      try {
        setIsLoading(true);
        const data = await getPullRequests(owner, name);
        setPrs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pull requests');
      } finally {
        setIsLoading(false);
      }
    };

    loadPullRequests();
  }, [owner, name]);

  if (isLoading) {
    return <div className="text-center py-4">Loading pull requests...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (prs.length === 0) {
    return <div className="text-center py-4">No pull requests found</div>;
  }

  return (
    <div className="space-y-4">
      {prs.map((pr) => (
        <div
          key={pr.number}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              #{pr.number} {pr.title}
            </a>
            <span
              className={`px-2 py-1 rounded text-xs ${
                pr.state === 'open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {pr.state}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Opened by {pr.user.login} on{' '}
            {new Date(pr.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
