import MiniSearch, {type Options, type SearchResult} from 'minisearch';

export function searchReadyIndex(index: MiniSearch<any> | null, query: string): SearchResult[] {
  return index ? index.search(query) : [];
}

/** Publish an index only after all documents are ready; cleanup invalidates it. */
export function prepareSearchIndex<T>(
  documents: readonly T[],
  options: Options<T>,
  onReady: (index: MiniSearch<T>) => void,
  onFailure: (error: unknown) => void = error => console.warn('Search index unavailable', error),
): {cancel: () => void; done: Promise<void>} {
  let cancelled = false;
  const done = (async () => {
    const index = new MiniSearch<T>(options);
    await index.addAllAsync(documents);
    if (!cancelled) onReady(index);
  })().catch(error => {if (!cancelled) onFailure(error);});
  return {cancel: () => {cancelled = true;}, done};
}
