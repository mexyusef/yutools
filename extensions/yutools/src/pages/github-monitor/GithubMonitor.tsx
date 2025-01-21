import { useState } from 'react';
import { Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AddRepoDialog } from './AddRepoDialog';
import { RepoTabs } from './RepoTabs';
import { ReadmeViewer } from './ReadmeViewer';
import { SettingsDialog } from './SettingsDialog';
import { useGitHubStore } from './store';

export default function GithubMonitor() {
  const { repos, currentRepo, setCurrentRepo, resetStore } = useGitHubStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleHomeClick = () => {
    resetStore();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleHomeClick}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Home className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                GitHub Monitor
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {repos.map((repo) => (
                <a
                  key={`${repo.owner}/${repo.name}`}
                  href={`https://github.com/${repo.owner}/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentRepo(repo);
                    }}
                    variant={currentRepo === repo ? 'default' : 'outline'}
                  >
                    {repo.owner}/{repo.name}
                  </Button>
                </a>
              ))}
              <SettingsDialog />
            </div>
          </div>
        </div>
      </nav>

      {/* Scrollable main container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] overflow-y-auto">
        {!currentRepo ? (
          <div className="grid place-items-center h-[calc(100vh-12rem)]">
            <AddRepoDialog />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <RepoTabs />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  README
                </h2>
                <ReadmeViewer content={currentRepo.readme} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// import { Button } from '../ui/button';
// import { Home } from 'lucide-react';
// import { AddRepoDialog } from './AddRepoDialog';
// import { RepoTabs } from './RepoTabs';
// import { ReadmeViewer } from './ReadmeViewer';
// import { SettingsDialog } from './SettingsDialog';
// import { useGitHubStore } from './store';


// export default function GithubMonitor() {
//   const { repos, currentRepo, setCurrentRepo, resetStore } = useGitHubStore();

//   const handleHomeClick = () => {
//     resetStore();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//       <nav className="bg-white dark:bg-gray-800 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleHomeClick}
//                 className="hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <Home className="h-5 w-5" />
//               </Button>
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//                 GitHub Monitor
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               {repos.map((repo) => (
//                 <a
//                   key={`${repo.owner}/${repo.name}`}
//                   href={`https://github.com/${repo.owner}/${repo.name}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <Button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentRepo(repo);
//                     }}
//                     variant={currentRepo === repo ? 'default' : 'outline'}
//                   >
//                     {repo.owner}/{repo.name}
//                   </Button>
//                 </a>
//               ))}
//               <SettingsDialog />
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {!currentRepo ? (
//           <div className="grid place-items-center h-[calc(100vh-12rem)]">
//             <AddRepoDialog />
//           </div>
//         ) : (
//           <div className="space-y-8">
//             <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <RepoTabs />
//               </div>
//             </div>

//             <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                   README
//                 </h2>
//                 <ReadmeViewer content={currentRepo.readme} />
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
