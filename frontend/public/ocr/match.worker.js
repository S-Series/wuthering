// All image matching runs locally, independently of the OCR request.
self.onmessage = async ({ data }) => {
  const mats = [];
  let bitmap;
  try {
    importScripts(data.cvUrl);
    const cv = await self.cv;
    const keep = mat => { mats.push(mat); return mat; };
    function mask(source, box, threshold) {
      const [x, y, w, h] = box;
      const canvas = new OffscreenCanvas(Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(source, x, y, w, h, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const values = new Uint8Array(canvas.width * canvas.height);
      for (let i = 0; i < values.length; i++) {
        const p = i * 4, low = Math.min(pixels[p], pixels[p+1], pixels[p+2]);
        const high = Math.max(pixels[p], pixels[p+1], pixels[p+2]);
        values[i] = low > threshold && high-low < 65 && pixels[p+3] > 128 ? 255 : 0;
      }
      return keep(cv.matFromArray(canvas.height, canvas.width, cv.CV_8UC1, values));
    }
    function label(source, box) {
      const raw = mask(source, box, 130);
      const count = cv.countNonZero(raw);
      if (count < 12 || count > raw.rows*raw.cols*0.75) return null;
      const bounds = cv.boundingRect(raw), roi = raw.roi(bounds), normalized = keep(new cv.Mat());
      try { cv.resize(roi, normalized, new cv.Size(160, 24), 0, 0, cv.INTER_AREA); }
      finally { roi.delete(); }
      return normalized;
    }
    async function load(url, transform) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`비교 이미지 로드 실패: ${url}`);
      const source = await createImageBitmap(await response.blob());
      try { return transform(source); } finally { source.close(); }
    }
    const scoreMat = keep(new cv.Mat());
    const score = (query, template) => {
      cv.matchTemplate(query, template, scoreMat, cv.TM_CCOEFF_NORMED);
      return cv.minMaxLoc(scoreMat).maxVal;
    };
    const accept = (ranked, threshold, margin) => {
      ranked.sort((a,b) => b.score-a.score);
      const best = ranked[0];
      return best && best.score >= threshold && best.score-(ranked[1]?.score ?? 0) >= margin ? best : null;
    };
    bitmap = await createImageBitmap(data.file);
    const { width, bands, icon } = data.metadata;
    const templates = [];
    for (const item of data.stats) {
      const template = await load(item.url, source => label(source, [Math.round(source.width*0.12), 0, source.width-Math.round(source.width*0.12), source.height]));
      if (template) templates.push({ id: item.id, template });
    }
    const rows = bands.filter(band => band.index >= 0).map(band => {
      const w = width-32;
      // Main-stat icons extend farther into the label area on some layouts.
      const queries = (band.index < 2 ? [0.10,0.12,0.14] : [0.10]).map(left =>
        label(bitmap, [16+w*left, band.top, w*(0.72-left), band.bottom-band.top])).filter(Boolean);
      const ranked = queries.length ? templates.map(item => ({ id: item.id, score: Math.max(...queries.map(query => score(query, item.template))) })) : [];
      return { index: band.index, match: accept(ranked, 0.75, 0.08) };
    });
    let harmony = null;
    if (icon[2]-icon[0] >= 8 && icon[3]-icon[1] >= 8) {
      const raw = mask(bitmap, [icon[0], icon[1], icon[2]-icon[0], icon[3]-icon[1]], 150);
      if (cv.countNonZero(raw) >= 8) {
        const normalized = keep(new cv.Mat()), query = keep(new cv.Mat());
        cv.resize(raw, normalized, new cv.Size(64,64), 0,0,cv.INTER_AREA);
        cv.copyMakeBorder(normalized, query, 16,16,16,16,cv.BORDER_CONSTANT,new cv.Scalar(0));
        const resized = keep(new cv.Mat()), ranked = [];
        for (const item of data.harmonies) {
          const template = await load(item.url, source => mask(source, [0,0,source.width,source.height], 150));
          if (cv.countNonZero(template) < 8) continue;
          let similarity = -1;
          for (let size=44; size<=80; size+=4) {
            cv.resize(template,resized,new cv.Size(size,size),0,0,cv.INTER_AREA);
            similarity = Math.max(similarity,score(query,resized));
          }
          ranked.push({ id: item.id, score: similarity });
        }
        harmony = accept(ranked,0.65,0.10);
      }
    }
    self.postMessage({ rows, harmony });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "이미지 비교 실패" });
  } finally {
    bitmap?.close();
    for (const mat of mats.reverse()) mat.delete();
  }
};
