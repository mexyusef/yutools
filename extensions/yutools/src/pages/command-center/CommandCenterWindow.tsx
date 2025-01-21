import { useState } from 'react';
import { ChevronRight, Command, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from './ThemeToggle';
import { Background } from './Background';
import { InfoCard } from './InfoCard';
import { FileExplorer } from './FileExplorer';
import { Terminal } from './Terminal';
import { Editor } from './Editor';
import { CommandCenter } from './CommandCenter';
import { cn } from '@/lib/utils';

export default function CommandCenterWindow() {
  const [collapsed, setCollapsed] = useState(false);
  const [editorContent, setEditorContent] = useState("// Write your code here");

  const handleEditorSave = (content: string) => {
    setEditorContent(content);
    console.log("Editor content saved:", content);
  };
  return (
    <div className={cn(
      'h-full transition-all duration-300',
      collapsed ? 'w-16' : 'w-full'
    )}>
      <Background />

      <div className="relative h-full border-r border-primary/10 bg-background/30 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between border-b border-primary/10 px-4">
          <div className="flex items-center gap-2">
            <Command className="h-5 w-5 text-primary/60" />
            {!collapsed && (
              <span className="text-sm font-medium text-primary/60">
                Command Center
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-primary/10"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              collapsed ? "rotate-180" : ""
            )} />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-7.5rem)] px-4 py-6">
          <div className="space-y-4 pr-4">

            <InfoCard title="Editor">
              <Editor
                content={editorContent}
                onSave={handleEditorSave}
              />
            </InfoCard>

            <InfoCard title="Commands">
              {/* <CommandCenter /> */}
              <CommandCenter editorContent={editorContent} />
            </InfoCard>

            <InfoCard title="File Explorer">
              <FileExplorer />
            </InfoCard>

            <InfoCard title="Terminal">
              <Terminal />
            </InfoCard>

            <InfoCard title="System Status">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">All systems operational</span>
              </div>
            </InfoCard>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 border-t border-primary/10 bg-background/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
