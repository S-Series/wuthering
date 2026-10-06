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
