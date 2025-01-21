import * as React from 'react';
import { cn } from 'utils/cn';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'placeholder:text-input-placeholder-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-border focus-visible:ring-offset-2 focus-visible:ring-offset-panel-background disabled:opacity-50',
          'flex min-h-[80px] w-full rounded-xs border border-input-border bg-input-background px-3 py-2 text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
