import type {
  ExtractionRequestMessage,
  ExtractionResponseMessage,
  ExtractionResult,
} from './types';

const MESSAGE_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;
const CONTENT_SCRIPT_PATH = 'content-scripts/content.js';

async function findActiveReclaimTab(): Promise<chrome.tabs.Tab | null> {
  const tabs = await chrome.tabs.query({ url: `*://app.reclaim.ai/*` });

  if (tabs.length === 0) {
    return null;
  }

  if (tabs.length === 1) {
    return tabs[0];
  }

  const activeTabs = tabs.filter((t) => t.active);
  if (activeTabs.length > 0) {
    return activeTabs[0];
  }

  return tabs[tabs.length - 1];
}

function sendMessage(
  tabId: number,
  message: ExtractionRequestMessage,
): Promise<ExtractionResponseMessage> {
  return new Promise<ExtractionResponseMessage>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Extraction request timed out'));
    }, MESSAGE_TIMEOUT_MS);

    chrome.tabs.sendMessage(tabId, message, (chromeResponse) => {
      clearTimeout(timeout);
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (chromeResponse) {
        resolve(chromeResponse as ExtractionResponseMessage);
      } else {
        reject(new Error('No response from content script'));
      }
    });
  });
}

function isContentScriptNotReadyError(message: string): boolean {
  return (
    message.includes('Could not establish connection') ||
    message.includes('Receiving end does not exist')
  );
}

async function injectContentScript(tabId: number): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: [CONTENT_SCRIPT_PATH],
  });
}

export async function sendMessageToActiveTab(
  route: ExtractionRequestMessage['route'],
): Promise<ExtractionResult> {
  const tab = await findActiveReclaimTab();

  if (!tab?.id) {
    throw new Error('No active reclaim.ai tab found');
  }

  const message: ExtractionRequestMessage = {
    type: 'RECLAIM_STATS:EXTRACTION_REQUEST',
    route,
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await sendMessage(tab.id, message);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.result) {
        throw new Error('Extraction returned no result');
      }

      return response.result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (
        attempt < MAX_RETRIES &&
        isContentScriptNotReadyError(lastError.message)
      ) {
        try {
          await injectContentScript(tab.id);
        } catch {
          // Content script may already be registered, continue to retry
        }
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError ?? new Error('Extraction failed after retries');
}
