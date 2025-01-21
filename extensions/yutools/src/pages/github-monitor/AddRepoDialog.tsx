import React, { useState, useEffect } from "react";
import { Button } from '../../components/ui/button';
import { useGitHubStore } from "./store";
import { getAllPresets, getAllHistory } from "./db";
import { AddPresetDialog } from "./AddPresetDialog";
import { RepoHistory } from "./RepoHistory";
import type { PresetRepo } from "./db";

interface HistoryRepo {
  id?: number;
  owner: string;
  name: string;
  url: string;
  lastVisited: Date;
}

export function AddRepoDialog() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState<PresetRepo[]>([]);
  const [history, setHistory] = useState<HistoryRepo[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsible state for recent repos
  const addRepo = useGitHubStore((state) => state.addRepo);

  useEffect(() => {
    loadPresets();
    loadHistory();
  }, []);

  const loadPresets = async () => {
    try {
      const presetRepos = await getAllPresets();
      setPresets(presetRepos);
    } catch (error) {
      console.error("Failed to load presets:", error);
    }
  };

  const loadHistory = async () => {
    try {
      const historyRepos = await getAllHistory();
      setHistory(historyRepos);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await addRepo(url);
      setUrl("");
      loadHistory(); // Refresh history after adding new repo
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add repository");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = async (presetUrl: string) => {
    setUrl(presetUrl);
    setError("");
    setIsLoading(true);

    try {
      await addRepo(presetUrl);
      loadHistory(); // Refresh history after adding preset
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add repository");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Repository
      </h2>

      {/* <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-blue-500 dark:text-blue-300"
      >
        {isCollapsed ? "Show" : "Hide"}
      </button> */}
      {/* <button
  onClick={() => setIsCollapsed(!isCollapsed)}
  className="relative px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-70 backdrop-blur-md hover:bg-opacity-80 hover:shadow-neon"
>
  <span className="text-shadow">
    {isCollapsed ? "Show" : "Hide"}
  </span>
</button> */}

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`relative px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105 shadow-lg border
    ${
      isCollapsed
        ? "border-green-500 bg-gradient-to-r from-green-500 to-teal-500"
        : "border-red-500 bg-gradient-to-r from-red-500 to-pink-500"
    }
    bg-opacity-70 backdrop-blur-md hover:bg-opacity-80 hover:shadow-neon`}
      >
        <span className="text-shadow">{isCollapsed ? "Show" : "Hide"}</span>
      </button>

      {!isCollapsed && (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Recent Repositories
              </h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto mt-4">
              <RepoHistory history={history} onHistoryChange={loadHistory} />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Popular Repositories
              </h3>
              <AddPresetDialog onPresetAdded={loadPresets} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((repo) => (
                <Button
                  key={repo.id}
                  variant="outline"
                  onClick={() => handlePresetClick(repo.url)}
                  disabled={isLoading}
                  className="text-sm h-auto py-2 px-3 justify-start"
                >
                  {repo.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            or enter URL manually
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="repo-url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            GitHub Repository URL
          </label>
          <input
            id="repo-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
            required
            disabled={isLoading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding Repository..." : "Add Repository"}
        </Button>
      </form>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { Button } from '../ui/button';
// import { useGitHubStore } from './store';
// import { getAllPresets, getAllHistory } from './db';
// import { AddPresetDialog } from './AddPresetDialog';
// import { RepoHistory } from './RepoHistory';
// import type { PresetRepo } from './db';

// interface HistoryRepo {
//   id?: number;
//   owner: string;
//   name: string;
//   url: string;
//   lastVisited: Date;
// }

// export function AddRepoDialog() {
//   const [url, setUrl] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [presets, setPresets] = useState<PresetRepo[]>([]);
//   const [history, setHistory] = useState<HistoryRepo[]>([]);
//   const addRepo = useGitHubStore((state) => state.addRepo);

//   useEffect(() => {
//     loadPresets();
//     loadHistory();
//   }, []);

//   const loadPresets = async () => {
//     try {
//       const presetRepos = await getAllPresets();
//       setPresets(presetRepos);
//     } catch (error) {
//       console.error('Failed to load presets:', error);
//     }
//   };

//   const loadHistory = async () => {
//     try {
//       const historyRepos = await getAllHistory();
//       setHistory(historyRepos);
//     } catch (error) {
//       console.error('Failed to load history:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       await addRepo(url);
//       setUrl('');
//       loadHistory(); // Refresh history after adding new repo
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to add repository');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePresetClick = async (presetUrl: string) => {
//     setUrl(presetUrl);
//     setError('');
//     setIsLoading(true);

//     try {
//       await addRepo(presetUrl);
//       loadHistory(); // Refresh history after adding preset
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to add repository');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
//       <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add Repository</h2>

//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Recent Repositories</h3>
//         </div>
//         <RepoHistory history={history} onHistoryChange={loadHistory} />
//       </div>

//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Popular Repositories</h3>
//           <AddPresetDialog onPresetAdded={loadPresets} />
//         </div>
//         <div className="grid grid-cols-2 gap-2">
//           {presets.map((repo) => (
//             <Button
//               key={repo.id}
//               variant="outline"
//               onClick={() => handlePresetClick(repo.url)}
//               disabled={isLoading}
//               className="text-sm h-auto py-2 px-3 justify-start"
//             >
//               {repo.name}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t border-gray-300 dark:border-gray-600" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//             or enter URL manually
//           </span>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//         <div>
//           <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//             GitHub Repository URL
//           </label>
//           <input
//             id="repo-url"
//             type="text"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             placeholder="https://github.com/owner/repo"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
//             required
//             disabled={isLoading}
//           />
//           {error && (
//             <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
//           )}
//         </div>
//         <Button
//           type="submit"
//           className="w-full"
//           disabled={isLoading}
//         >
//           {isLoading ? 'Adding Repository...' : 'Add Repository'}
//         </Button>
//       </form>
//     </div>
//   );
// }
