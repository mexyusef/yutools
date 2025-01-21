import { Terminal as TerminalIcon, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TerminalOutput {
  content: string;
  type: 'input' | 'output';
}

export function Terminal() {
  const [history, setHistory] = useState<TerminalOutput[]>([
    { content: '$ Welcome to the terminal', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory([
      ...history,
      { content: `$ ${input}`, type: 'input' },
      { content: `Executed: ${input}`, type: 'output' },
    ]);
    setInput('');
  };

  return (
    <div className="flex h-[300px] flex-col rounded-lg border border-primary/10 bg-background/30 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-primary/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-2 font-mono text-sm">
          {history.map((entry, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap",
                entry.type === 'input' ? 'text-primary/80' : 'text-muted-foreground'
              )}
            >
              {entry.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleCommand} className="border-t border-primary/10 p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="font-mono"
        />
      </form>
    </div>
  );
}