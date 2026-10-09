/* Detect text bands independently of the language-specific COST template. */
function findStatRows(pixels, width, height, unit) {
  const counts = new Uint32Array(height);
  const startX = Math.round(width * 0.12), endX = Math.round(width * 0.94);
  for (let y = 0; y < height; y++) {
    for (let x = startX; x < endX; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      if (Math.min(r, g, b) >= 155 && Math.max(r, g, b) - Math.min(r, g, b) < 65) counts[y]++;
    }
  }
  const threshold = Math.max(3, (endX - startX) * 0.025);
  const bands = [];
  let start = -1, last = -1;
  for (let y = 0; y <= height + 2; y++) {
    if (y < height && counts[y] >= threshold) {
      if (start < 0) start = y;
      last = y;
    } else if (start >= 0 && y - last > Math.max(2, unit * 0.035)) {
      if (last - start + 1 >= Math.max(4, unit * 0.07)) bands.push({ top: start, bottom: last + 1, center: (start + last + 1) / 2 });
      start = -1;
    }
  }
  const candidates = [];
  for (let i = 0; i + 7 <= bands.length; i++) {
    const rows = bands.slice(i, i + 7);
    if (rows[0].center < unit * 0.35 || rows[0].center > unit * 1.45) continue;
    const gaps = rows.slice(1).map((row, index) => row.center - rows[index].center);
    const pitch = [...gaps].sort((a, b) => a - b)[3];
    if (pitch < unit * 0.4 || pitch > unit * 0.9 || gaps.some(gap => Math.abs(gap - pitch) > pitch * 0.2)) continue;
    if (rows.some(row => row.bottom - row.top > pitch * 0.8)) continue;
    const error = gaps.reduce((sum, gap) => sum + Math.abs(gap - pitch), 0) / pitch;
    candidates.push({ rows, pitch, error });
  }
  candidates.sort((a, b) => a.error - b.error);
  const best = candidates[0];
  if (!best) return null;
  return best.rows.map(row => {
    const padding = Math.max(2, unit * 0.06);
    return { center: row.center, half: Math.min(best.pitch * 0.46, Math.max(best.pitch * 0.36, (row.bottom - row.top) / 2 + padding)) };
  });
}
