import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { FILE_OPERATIONS } from "@/lib/constants";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "directory";
  children?: FileNode[];
}

const mockFiles: FileNode[] = [
  {
    name: "src",
    type: "directory",
    children: [
      { name: "App.tsx", type: "file" },
      { name: "main.tsx", type: "file" },
      {
        name: "components",
        type: "directory",
        children: [
          { name: "Button.tsx", type: "file" },
          { name: "Input.tsx", type: "file" },
        ],
      },
    ],
  },
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
];

export function FileExplorer() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) =>
      prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path]
    );
  };

  const toggleFile = (path: string) => {
    setSelectedFiles((prev) =>
      prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path]
    );
  };

  const renderNode = (node: FileNode, path: string = "") => {
    const fullPath = `${path}/${node.name}`;
    const isExpanded = expandedFolders.includes(fullPath);
    const isSelected = selectedFiles.includes(fullPath);

    return (
      <div key={fullPath} className="ml-4">
        <div className="flex items-center gap-2 py-1">
          {node.type === "directory" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleFile(fullPath)}
              className="ml-6"
            />
          )}
          {node.type === "directory" ? (
            <Folder className="h-4 w-4 text-blue-400" />
          ) : (
            <File className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === "directory" && isExpanded && node.children && (
          <div className="ml-2">
            {node.children.map((child) => renderNode(child, fullPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-md p-4">
      <h3 className="text-lg font-semibold mb-4">File Explorer</h3>
      <ScrollArea className="h-[300px]">
        {mockFiles.map((node) => renderNode(node))}
      </ScrollArea>
      <div className="mt-4 space-y-2">
        {FILE_OPERATIONS.map((operation) => (
          <Button
            key={operation}
            variant="secondary"
            className="w-full justify-start text-left"
            disabled={selectedFiles.length === 0}
            onClick={() => console.log(operation, selectedFiles)}
          >
            {operation}
          </Button>
        ))}
      </div>
    </div>
  );
}