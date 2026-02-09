'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GlossaryTermProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export function GlossaryTerm({ term, definition, children }: GlossaryTermProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="underline decoration-dotted decoration-muted-foreground/60 underline-offset-2 cursor-help"
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs" side="top">
          <p>
            <span className="font-semibold">{term}:</span>{' '}
            {definition}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
