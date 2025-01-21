import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


type MessageBubbleProps = {
  message: {
    content: string;
    sender: 'user' | 'system';
    timestamp: Date;
  };
  onCopyToInput: (content: string) => void;
};

// export default function MessageBubble({ message }: MessageBubbleProps) {
export default function MessageBubble({ message, onCopyToInput }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn('flex items-start gap-2', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}
    >

      {isUser && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onCopyToInput(message.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Copy to input</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%] break-words shadow-md',
          {
            'bg-primary text-primary-foreground': isUser,
            'bg-muted': !isUser,
          }
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // code({ node, inline, className, children, ...props }) {
              //   const match = /language-(\w+)/.exec(className || '');
              //   return !inline && match ? (
              //     <SyntaxHighlighter
              //       style={oneDark}
              //       language={match[1]}
              //       PreTag="div"
              //       className="rounded-md border"
              //       {...props}
              //     >
              //       {String(children).replace(/\n$/, '')}
              //     </SyntaxHighlighter>
              //   ) : (
              //     <code className={cn("bg-muted px-1 py-0.5 rounded text-sm font-mono", className)} {...props}>
              //       {children}
              //     </code>
              //   );
              // },
              code(props) {
                const {children, className, ...rest} = props
                const match = /language-(\w+)/.exec(className || '')
                return !match ? (
                  <code className={cn("bg-muted px-1 py-0.5 rounded text-sm font-mono", className)} {...rest}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    {...rest}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md border"
                    ref={undefined} // Explicitly set ref to undefined to avoid type error
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
              // Style other markdown elements
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary/50 pl-2 italic mb-2">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-2">
                  <table className="min-w-full divide-y divide-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-2 py-1 font-semibold text-left border-b">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-2 py-1 border-b border-border/50">
                  {children}
                </td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p className="text-xs opacity-70 mt-2">
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>

      {!isUser && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onCopyToInput(message.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Copy to input</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

    </div>
  );
}
