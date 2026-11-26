import {useMemo, useRef} from 'react';

/** Refresh card content without reshuffling existing IDs in the same detail view. */
export function useStableContentShuffle<T extends {id: unknown}>(items: readonly T[], scope: unknown): T[] {
  const order = useRef<{scope: unknown; ranks: Map<string, number>}>({scope, ranks: new Map()});
  return useMemo(() => {
    if (order.current.scope !== scope) order.current = {scope, ranks: new Map()};
    const ranks = order.current.ranks;
    const nextRank = Math.ceil(Math.max(0, ...ranks.values()));
    for (const item of items) {
      if (!ranks.has(String(item.id))) ranks.set(String(item.id), nextRank + Math.random());
    }
    return [...items].sort((a, b) => ranks.get(String(a.id))! - ranks.get(String(b.id))!);
  }, [items, scope]);
}
