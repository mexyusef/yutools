import React, { useEffect, useState } from 'react';
import { getIssues } from './services/github-api';

interface Issue {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  user: {
    login: string;
  };
}

interface IssuesListProps {
  owner: string;
  name: string;
}

export function IssuesList({ owner, name }: IssuesListProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setIsLoading(true);
        const data = await getIssues(owner, name);
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issues');
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [owner, name]);

  if (isLoading) {
    return <div className="text-center py-4">Loading issues...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (issues.length === 0) {
    return <div className="text-center py-4">No issues found</div>;
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue.number}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex items-center justify-between">
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              #{issue.number} {issue.title}
            </a>
            <span
              className={`px-2 py-1 rounded text-xs ${
                issue.state === 'open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {issue.state}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Opened by {issue.user.login} on{' '}
            {new Date(issue.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
