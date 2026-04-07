import { extractEvents } from '@/lib/extract-events';
import { getCurrentRoute, getRouteType } from '@/lib/router';
import { saveResult } from '@/lib/storage';
import type {
  ExtractionRequestMessage,
  ExtractionResponseMessage,
} from '@/lib/types';

export default defineContentScript({
  matches: ['*://app.reclaim.ai/*'],
  main() {
    browser.runtime.onMessage.addListener(
      (
        message: ExtractionRequestMessage,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response: ExtractionResponseMessage) => void,
      ) => {
        if (message.type !== 'RECLAIM_STATS:EXTRACTION_REQUEST') {
          return false;
        }
        (async () => {
          const route =
            message.route ??
            getCurrentRoute() ??
            getRouteType(window.location.pathname);
          if (!route) {
            sendResponse({
              result: null,
              error: 'Unknown route',
              type: 'RECLAIM_STATS:EXTRACTION_RESPONSE',
            });
            return;
          }
          const result = await extractEvents(route);
          await saveResult(result);
          sendResponse({
            result,
            error: null,
            type: 'RECLAIM_STATS:EXTRACTION_RESPONSE',
          });
        })();
        return true;
      },
    );
  },
});
