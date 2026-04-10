import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Markdown from 'markdown-to-jsx';
import { formatMarkdown, isUnscheduled } from '@/lib/format-markdown';
import type { ExtractionResult } from '@/lib/types';
import { ExportActions } from './ExportActions';

interface ResultsViewProps {
  result: ExtractionResult | null;
}

export function ResultsView({ result }: ResultsViewProps) {
  if (!result || result.events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              No extraction data yet. Go to
              <a
                href="https://app.reclaim.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                app.reclaim.ai{' '}
              </a>
              and click the Generate button to extract events.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const scheduled = result.events.filter((e) => !isUnscheduled(e));
  const scheduledCount = scheduled.length;
  const formattedDate = new Date(result.timestamp).toLocaleString();

  const markdown = formatMarkdown(
    result.events,
    result.route ?? '',
    result.timestamp,
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Extraction Results</span>
            <div className="flex gap-1.5">
              <Badge variant="secondary">{result.route}</Badge>
              <Badge>
                {scheduledCount} event{scheduledCount !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Extracted at {formattedDate}
        </CardContent>
      </Card>

      <ExportActions result={result} />

      <div className="prose text-xs pt-3">
        <Markdown
          options={{
            overrides: {
              h1: {
                props: { className: 'text-base font-bold  text-primary' },
              },
              h2: {
                props: {
                  className: 'text-base font-semibold  text-primary',
                },
              },
              h3: {
                props: {
                  className: 'text-base font-semibold text-primary',
                },
              },
              li: { props: { className: 'text-sm  text-foreground' } },
              strong: { props: { className: 'text-foreground' } },
              table: {
                props: {
                  className: 'w- text-sm border-collapse text-foreground',
                },
              },
              th: { props: { className: 'text-foreground' } },
              tr: {
                props: { className: 'even:bg-secondary' },
              },
              summary: {
                props: {
                  className: 'font-semibold text-foreground',
                },
              },
            },
          }}
        >
          {markdown}
        </Markdown>
      </div>
    </>
  );
}
