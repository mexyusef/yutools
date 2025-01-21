import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { useSettingsStore } from './settings';

interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

const columnHelper = createColumnHelper<Commit>();

const columns = [
  columnHelper.accessor('sha', {
    header: 'SHA',
    cell: (info) => (
      <a
        href={info.row.original.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {info.getValue().substring(0, 7)}
      </a>
    ),
  }),
  columnHelper.accessor('commit.author.name', {
    header: 'Author',
  }),
  columnHelper.accessor('commit.author.date', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'PPpp'),
  }),
  columnHelper.accessor('commit.message', {
    header: 'Message',
    cell: (info) => info.getValue().split('\n')[0],
  }),
];

interface CommitsTableProps {
  commits: Commit[];
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
}

export function CommitsTable({
  commits,
  currentPage,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSize
}: CommitsTableProps) {
  const { commitsPerPage, setCommitsPerPage } = useSettingsStore();

  const table = useReactTable({
    data: commits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isLastPage = currentPage >= totalPages;
  const displayedTotal = Math.min(currentPage * pageSize, totalCount);
  const startItem = Math.min(((currentPage - 1) * pageSize) + 1, totalCount);

  const handlePageSizeChange = (newPageSize: number) => {
    setCommitsPerPage(newPageSize);
    onPageSizeChange(newPageSize);
  };

  if (!commits.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No commits found in this repository.</p>
        {currentPage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="mt-4"
          >
            Return to first page
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Commits per page:
          </label>
          <select
            value={commitsPerPage}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm p-1"
          >
            {[10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span>
            Showing {startItem} to{' '}
            {displayedTotal} of {totalCount} commits
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
