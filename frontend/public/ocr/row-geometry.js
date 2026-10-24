/* Locate each text region from its pixels. COST only bounds the search area. */
function isRegionText(pixels, i, tinted = false) {
  const low = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
  const high = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
  return low >= (tinted ? 110 : 155) && high >= 155 && high - low < (tinted ? 150 : 65);
}

function textBands(pixels, width, height, unit, tinted = false, inset = true) {
  const startX = inset ? Math.round(width * 0.12) : 0;
  const endX = inset ? Math.round(width * 0.94) : width;
  const threshold = Math.max(3, (endX - startX) * 0.025);
  const bands = [];
  let start = -1, last = -1;
  for (let y = 0; y <= height + 2; y++) {
    let count = 0;
    if (y < height) {
      for (let x = startX; x < endX; x++) {
        if (isRegionText(pixels, (y * width + x) * 4, tinted)) count++;
      }
    }
    if (count >= threshold) {
      if (start < 0) start = y;
      last = y;
    } else if (start >= 0 && y - last > Math.max(2, unit * 0.035)) {
      const size = last - start + 1;
      // Ignore divider lines and large patches of background.
      if (size >= Math.max(4, unit * 0.07) && size <= unit * 0.65) {
        bands.push({ top: start, bottom: last + 1, center: (start + last + 1) / 2 });
      }
      start = -1;
    }
  }
  return bands;
}

function findRegionBounds(pixels, width, height, unit, tinted = false) {
  const bands = textBands(pixels, width, height, unit, tinted, false);
  if (!bands.length) return null;
  let left = width, right = -1;
  for (let x = 0; x < width; x++) {
    let count = 0;
    for (const band of bands) {
      for (let y = band.top; y < band.bottom; y++) {
        if (isRegionText(pixels, (y * width + x) * 4, tinted)) count++;
      }
    }
    if (count >= Math.max(2, unit * 0.025)) {
      left = Math.min(left, x);
      right = x + 1;
    }
  }
  if (right <= left) return null;
  const padX = Math.max(3, Math.ceil(unit * 0.08));
  const padY = Math.max(3, Math.ceil(unit * 0.06));
  return { left: Math.max(0, left - padX), right: Math.min(width, right + padX),
    top: Math.max(0, bands[0].top - padY), bottom: Math.min(height, bands.at(-1).bottom + padY) };
}

function findStatRows(pixels, width, height, unit, expectedCenters) {
  const bands = textBands(pixels, width, height, unit);
  // Ordered matching keeps a missing row from shifting all subsequent options.
  // There is no shared pitch/height: every accepted band's bounds are independent.
  const memo = new Map();
  function match(index, first) {
    if (index === expectedCenters.length) return { cost: 0, rows: [] };
    const key = `${index}:${first}`;
    if (memo.has(key)) return memo.get(key);
    const missing = match(index + 1, first);
    let best = { cost: missing.cost + expectedCenters.length + 1, rows: [null, ...missing.rows] };
    const center = expectedCenters[index];
    const gap = Math.min(index ? center - expectedCenters[index - 1] : Infinity,
      index + 1 < expectedCenters.length ? expectedCenters[index + 1] - center : Infinity);
    const tolerance = Math.min(unit * 0.58, gap * 0.9);
    for (let i = first; i < bands.length; i++) {
      const distance = Math.abs(bands[i].center - center);
      if (distance > tolerance) continue;
      const next = match(index + 1, i + 1);
      const cost = next.cost + distance / tolerance;
      if (cost < best.cost) best = { cost, rows: [bands[i], ...next.rows] };
    }
    memo.set(key, best);
    return best;
  }
  return match(0, 0).rows.map(row => {
    if (!row) return null;
    const pad = Math.max(3, Math.ceil(unit * 0.06));
    const top = Math.max(0, row.top - pad), bottom = Math.min(height, row.bottom + pad);
    const bounds = findRegionBounds(pixels.subarray(top * width * 4, bottom * width * 4), width, bottom - top, unit);
    return bounds ? { ...bounds, top: top + bounds.top, bottom: top + bounds.bottom,
      center: row.center, half: (bottom - top) / 2 } : null;
  });
}
