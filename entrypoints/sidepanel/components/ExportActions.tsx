import { Clipboard, Download } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatMarkdown } from '@/lib/format-markdown';
import type { ExtractionResult } from '@/lib/types';

interface ExportActionsProps {
  result: ExtractionResult | null;
}

export function ExportActions({ result }: ExportActionsProps) {
  const [copied, setCopied] = useState(false);
  const hasData = result !== null && result.events.length > 0;

  const handleCopy = async () => {
    if (!result) return;
    const markdown = formatMarkdown(
      result.events,
      result.route ?? '',
      result.timestamp,
    );
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const markdown = formatMarkdown(
      result.events,
      result.route ?? '',
      result.timestamp,
    );
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reclaim-stats-${result.route}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        disabled={!hasData}
        onClick={handleCopy}
      >
        <Clipboard className="w-4 h-4 mr-1.5" />
        {copied ? 'Copied!' : 'Copy Markdown'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        disabled={!hasData}
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-1.5" />
        Download .md
      </Button>
    </div>
  );
}
