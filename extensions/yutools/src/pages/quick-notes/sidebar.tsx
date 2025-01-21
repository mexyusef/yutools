import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Theme } from '@/lib/themes';
import { type Note } from './types';

interface SidebarProps {
  notes: Note[];
  currentNoteId: string | null;
  theme: Theme;
  position: 'left' | 'right';
  onNoteCreate: () => void;
  onNoteSelect: (id: string) => void;
  onNoteDelete: (id: string) => void;
  children: React.ReactNode; // This will be the editor component
}

export function Sidebar({
  notes,
  currentNoteId,
  theme,
  position,
  onNoteCreate,
  onNoteSelect,
  onNoteDelete,
  children
}: SidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <Button
        onClick={onNoteCreate}
        className={cn("w-full mb-4 bg-gradient-to-r hover:opacity-90", theme.from, theme.to)}
      >
        <Plus className="mr-2 h-4 w-4" /> New
      </Button>
      <ScrollArea className="flex-grow">
        <div className="space-y-2 pr-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all backdrop-blur-sm",
                currentNoteId === note.id
                  ? `${theme.bgColor} text-white`
                  : "hover:bg-white/5 text-blue-100"
              )}
              onClick={() => onNoteSelect(note.id)}
            >
              <div className="truncate flex-1">{note.title}</div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteDelete(note.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  if (position === 'left') {
    return (
      <>
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="p-4">
          {sidebarContent}
        </ResizablePanel>
        <ResizableHandle className={cn("w-1.5 bg-gradient-to-b", theme.from, theme.to, "opacity-50 transition-opacity hover:opacity-100")} />
        <ResizablePanel defaultSize={80} minSize={30}>
          {children}
        </ResizablePanel>
      </>
    );
  }

  return (
    <>
      <ResizablePanel defaultSize={80} minSize={30}>
        {children}
      </ResizablePanel>
      <ResizableHandle className={cn("w-1.5 bg-gradient-to-b", theme.from, theme.to, "opacity-50 transition-opacity hover:opacity-100")} />
      <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="p-4">
        {sidebarContent}
      </ResizablePanel>
    </>
  );
}