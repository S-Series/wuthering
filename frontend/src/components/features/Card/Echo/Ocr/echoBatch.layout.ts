export type BatchLayout = { slots: string[]; pool: string[] };

export function placeBatchEntry(layout: BatchLayout, id: string, target: number): BatchLayout {
  if (!Number.isInteger(target) || target < 0 || target >= layout.slots.length || layout.slots[target] === id) return layout;
  const from = layout.slots.indexOf(id), pooled = layout.pool.indexOf(id);
  if (from < 0 && pooled < 0) return layout;
  const slots = [...layout.slots], pool = [...layout.pool];
  const displaced = slots[target];
  slots[target] = id;
  if (from >= 0) slots[from] = displaced;
  else pool[pooled] = displaced;
  return { slots, pool };
}

export function placeBatchPoolEntry(layout: BatchLayout, id: string, targetId: string): BatchLayout {
  const target = layout.pool.indexOf(targetId);
  if (target < 0 || id === targetId) return layout;
  const from = layout.slots.indexOf(id), pooled = layout.pool.indexOf(id);
  if (from < 0 && pooled < 0) return layout;
  const slots = [...layout.slots], pool = [...layout.pool];
  if (from >= 0) {
    slots[from] = targetId;
    pool[target] = id;
  } else {
    pool.splice(pooled, 1);
    pool.splice(target, 0, id);
  }
  return { slots, pool };
}
