import { storage } from 'wxt/utils/storage';
import type { ExtractionResult } from './types';

const STORAGE_KEY = 'local:latestResult';

export async function saveResult(result: ExtractionResult): Promise<void> {
  await storage.setItem(STORAGE_KEY, result);
}

export async function getLatestResult(): Promise<ExtractionResult | null> {
  return storage.getItem<ExtractionResult>(STORAGE_KEY);
}

export function watchResult(
  callback: (result: ExtractionResult | null) => void,
): () => void {
  return storage.watch(STORAGE_KEY, callback);
}

export async function clearResult(): Promise<void> {
  await storage.removeItem(STORAGE_KEY);
}
