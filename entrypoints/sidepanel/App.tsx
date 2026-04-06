import '@/assets/tailwind.css';
import { Play, Trash } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { sendMessageToActiveTab } from '@/lib/messaging';
import { clearResult, getLatestResult, watchResult } from '@/lib/storage';
import type { ExtractionResult } from '@/lib/types';
import { ResultsView } from './components/ResultsView';

type ExtractStatus = 'idle' | 'loading' | 'success' | 'error';

function AppContent() {
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [extractStatus, setExtractStatus] = useState<ExtractStatus>('idle');
  const [extractMessage, setExtractMessage] = useState<string>('');

  useEffect(() => {
    getLatestResult().then(setResult);
    const unwatch = watchResult(setResult);
    return unwatch;
  }, []);

  const handleAction = async () => {
    if (result) {
      await clearResult();
      setResult(null);
      return;
    }

    setExtractStatus('loading');
    setExtractMessage('');
    try {
      const data = await sendMessageToActiveTab('planner');
      setResult(data);
      setExtractStatus('success');
      setExtractMessage(
        `Extracted ${data.count} event${data.count !== 1 ? 's' : ''}`,
      );
      setTimeout(() => {
        setExtractStatus('idle');
        setExtractMessage('');
      }, 3000);
    } catch (error) {
      setExtractStatus('error');
      setExtractMessage(
        error instanceof Error ? error.message : 'Extraction failed',
      );
      setTimeout(() => {
        setExtractStatus('idle');
        setExtractMessage('');
      }, 5000);
    }
  };

  return (
    <div className="p-4 space-y-4 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold">Reclaim Stats Exporter</h1>
        <ModeToggle />
      </div>

      <Button
        className="w-full"
        onClick={handleAction}
        disabled={extractStatus === 'loading'}
        variant={
          extractStatus === 'error'
            ? 'destructive'
            : result
              ? 'secondary'
              : 'default'
        }
      >
        {result ? (
          <>
            <Trash className="w-4 h-4 mr-1.5" />
            Clear Markdown
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-1.5" />
            {extractStatus === 'loading'
              ? 'Extracting...'
              : extractStatus === 'success'
                ? extractMessage
                : extractStatus === 'error'
                  ? extractMessage
                  : 'Extract Events'}
          </>
        )}
      </Button>

      <ResultsView result={result} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="reclaim-stats-theme">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
