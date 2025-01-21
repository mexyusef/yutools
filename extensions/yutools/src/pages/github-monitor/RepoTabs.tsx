import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { CommitsTable } from './CommitsTable';
import { IssuesList } from './IssuesList';
import { PullRequestsList } from './PullRequestsList';
import { useGitHubStore } from './store';
import { useSettingsStore } from './settings';

export function RepoTabs() {
  const { currentRepo, fetchCommits } = useGitHubStore();
  const { commitsPerPage } = useSettingsStore();

  if (!currentRepo) return null;

  const handlePageChange = async (page: number) => {
    if (currentRepo) {
      await fetchCommits(currentRepo.owner, currentRepo.name, page, commitsPerPage);
    }
  };

  const handlePageSizeChange = async (pageSize: number) => {
    if (currentRepo) {
      // Always return to first page when changing page size
      await fetchCommits(currentRepo.owner, currentRepo.name, 1, pageSize);
    }
  };

  return (
    <Tabs defaultValue="commits" className="space-y-4">
      <TabsList>
        <TabsTrigger value="commits">Commits</TabsTrigger>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
      </TabsList>
      <TabsContent value="commits" className="space-y-4">
        <CommitsTable
          commits={currentRepo.commits}
          currentPage={currentRepo.currentPage}
          totalCount={currentRepo.totalCount}
          pageSize={commitsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </TabsContent>
      <TabsContent value="issues">
        <IssuesList owner={currentRepo.owner} name={currentRepo.name} />
      </TabsContent>
      <TabsContent value="pulls">
        <PullRequestsList owner={currentRepo.owner} name={currentRepo.name} />
      </TabsContent>
    </Tabs>
  );
}
