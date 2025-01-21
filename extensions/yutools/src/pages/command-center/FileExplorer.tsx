import { FileText, Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { name: 'src', type: 'folder', path: '/src' },
    { name: 'package.json', type: 'file', path: '/package.json' },
  ]);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const handleCreateFile = () => {
    if (newFileName) {
      setFiles([...files, { 
        name: newFileName, 
        type: 'file', 
        path: `/${newFileName}` 
      }]);
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Files</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCreatingFile(true)}
          className="h-6 w-6"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isCreatingFile && (
        <div className="flex gap-2">
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.ext"
            className="h-8"
          />
          <Button size="sm" onClick={handleCreateFile}>Create</Button>
        </div>
      )}

      <ScrollArea className="h-[200px]">
        <div className="space-y-1">
          {files.map((file) => (
            <Button
              key={file.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 px-2",
                "hover:bg-primary/10"
              )}
            >
              {file.type === 'folder' ? (
                <Folder className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span className="text-sm">{file.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}