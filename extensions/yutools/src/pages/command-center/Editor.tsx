import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clipboard, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorProps {
  content: string;
  language?: string;
  onSave?: (content: string) => void;
}

export function Editor({ content: initialContent, language = 'typescript', onSave }: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    onSave?.(content);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-primary/10 bg-background/30 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-primary/10 px-4 py-2">
        <span className="text-sm font-medium">{language}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-6 w-6"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="h-6 w-6"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={cn(
            "min-h-[300px] w-full resize-none bg-transparent p-2",
            "font-mono text-sm focus:outline-none"
          )}
        />
      </ScrollArea>

      {isCopied && (
        <div className="absolute right-4 top-4 rounded-md bg-primary/10 px-2 py-1 text-sm">
          Copied!
        </div>
      )}
    </div>
  );
}