import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface ReadmeViewerProps {
  content: string;
}

export function ReadmeViewer({ content }: ReadmeViewerProps) {
  return (
    <div className="prose prose-invert max-w-none p-6 bg-gray-900 rounded-lg">
      <ReactMarkdown
        components={{
          // code({ node, inline, className, children, ...props }) {
          //   const match = /language-(\w+)/.exec(className || '');
          //   return !inline && match ? (
          //     <SyntaxHighlighter
          //       style={vscDarkPlus}
          //       language={match[1]}
          //       PreTag="div"
          //       {...props}
          //     >
          //       {String(children).replace(/\n$/, '')}
          //     </SyntaxHighlighter>
          //   ) : (
          //     <code className={className} {...props}>
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
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md border"
                ref={undefined} // Explicitly set ref to undefined to avoid type error
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },

        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
