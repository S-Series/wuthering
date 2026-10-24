/* Classic worker: OpenCV/WASM stays off the UI thread and is freed on termination. */
self.onmessage = async ({ data }) => {
  let bitmap;
  const mats = [];
  try {
    importScripts(new URL("row-geometry.js", data.assetBase).href);
    importScripts(data.cvUrl);
    const cv = await self.cv;
    bitmap = await createImageBitmap(data.file);
    const originalWidth = bitmap.width, originalHeight = bitmap.height;
    if (bitmap.width * bitmap.height > 32000000 || Math.min(bitmap.width, bitmap.height) < 60) throw new Error("이미지 크기를 확인해주세요.");
    if (bitmap.height < 1080) {
      const width = Math.round(bitmap.width * 1080 / bitmap.height);
      if (width * 1080 > 32000000) throw new Error("확대 후 이미지 크기가 너무 큽니다.");
      const resized = new OffscreenCanvas(width, 1080);
      const context = resized.getContext("2d");
      if (!context) throw new Error("이미지 확대에 실패했습니다.");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(bitmap, 0, 0, width, 1080);
      bitmap.close();
      bitmap = undefined;
      bitmap = await createImageBitmap(resized);
    }
    const w = bitmap.width, h = bitmap.height;
    const profilesResponse = await fetch(new URL("profiles.json", data.assetBase));
    if (!profilesResponse.ok) throw new Error("이미지 기준 파일을 불러오지 못했습니다.");
    const profiles = await profilesResponse.json();
    const ratio = w / h, compact = ratio < 1.22;
    const expected = compact ? "panel" : ratio < 1.4 ? "fold" : ratio < 1.65 ? "tablet" : ratio < 1.95 ? "desktop-en" : ratio < 2.25 ? "phone" : "wide";
    const profile = profiles.find(p => p.id === expected);
    const left = compact ? 0 : Math.floor(w * 0.65), top = compact ? 0 : Math.floor(h * 0.07);
    const rh = (compact ? h : Math.floor(h * 0.55)) - top, rw = w-left;
    const scale = Math.min(1, 720 / Math.max(rw, rh));
    const canvas = new OffscreenCanvas(Math.round(rw*scale), Math.round(rh*scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(bitmap, left, top, rw, rh, 0, 0, canvas.width, canvas.height);
    const rgba = cv.matFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height)); mats.push(rgba);
    const search = new cv.Mat(); mats.push(search);
    cv.cvtColor(rgba, search, cv.COLOR_RGBA2GRAY);
    const response = await fetch(new URL(profile.template, data.assetBase));
    if (!response.ok) throw new Error("이미지 기준 파일을 불러오지 못했습니다.");
    const needleBitmap = await createImageBitmap(await response.blob());
    const tc = new OffscreenCanvas(needleBitmap.width, needleBitmap.height);
    const tx = tc.getContext("2d", { willReadFrequently: true });
    tx.drawImage(needleBitmap, 0, 0); needleBitmap.close();
    const tr = cv.matFromImageData(tx.getImageData(0, 0, tc.width, tc.height)); mats.push(tr);
    const base = new cv.Mat(); mats.push(base); cv.cvtColor(tr, base, cv.COLOR_RGBA2GRAY);
    const needle = new cv.Mat(), result = new cv.Mat(); mats.push(needle, result);
    const sx = canvas.width/rw, sy = canvas.height/rh, hits = [];
    for (let width = 18; width < Math.min(100, Math.floor(canvas.width/3)); width++) {
      const height = Math.max(5, Math.round(base.rows*width/base.cols));
      if (height >= search.rows) continue;
      cv.resize(base, needle, new cv.Size(width, height), 0, 0, cv.INTER_AREA);
      cv.matchTemplate(search, needle, result, cv.TM_CCOEFF_NORMED);
      const match = cv.minMaxLoc(result);
      if (match.maxVal < 0.64) continue;
      const x = left+match.maxLoc.x/sx, y = top+match.maxLoc.y/sy, unit = width/sx;
      // Move substat crops down by 3% of COST width at every input scale.
      const centers = profile.rows.map((offset, index) => y+(offset+(index >= 2 ? 0.03 : 0))*unit);
      const x1 = x+profile.left*unit, x2 = x+profile.right*unit;
      if (x2 > w+unit*0.5 || centers[6] > h+unit*0.15) continue;
      hits.push({ score: match.maxVal, x, y, unit, centers, x1, x2 });
    }
    hits.sort((a,b) => b.score-a.score);
    const best = hits[0];
    if (!best || hits.some(hit => hit.score > best.score-0.025 && Math.abs(hit.y-best.y) > best.unit)) {
      throw new Error("에코 영역을 찾지 못했습니다. COST와 옵션이 보이도록 오른쪽 상세 패널을 잘라 다시 올려주세요.");
    }
    const clamp = (box) => [Math.max(0, Math.min(w-1, Math.floor(box[0]))), Math.max(0, Math.min(h-1, Math.floor(box[1]))),
      Math.max(1, Math.min(w, Math.ceil(box[2]))), Math.max(1, Math.min(h, Math.ceil(box[3])))];
    const probeBox = clamp([best.x1, best.y, best.x2, best.y + best.unit * 6.5]);
    const probe = new OffscreenCanvas(probeBox[2]-probeBox[0], probeBox[3]-probeBox[1]);
    const probeContext = probe.getContext("2d", { willReadFrequently: true });
    probeContext.drawImage(bitmap, probeBox[0], probeBox[1], probe.width, probe.height, 0, 0, probe.width, probe.height);
    const detected = findStatRows(probeContext.getImageData(0, 0, probe.width, probe.height).data,
      probe.width, probe.height, best.unit, best.centers.map(center => center - probeBox[1]));
    const rows = detected.map((row, index) => row
      ? clamp([probeBox[0]+row.left, probeBox[1]+row.top, probeBox[0]+row.right, probeBox[1]+row.bottom])
      : clamp([best.x1, best.centers[index]-profile.half_row*best.unit,
        best.x2, best.centers[index]+profile.half_row*best.unit]));
    const header = clamp([best.x1, best.y+profile.top*best.unit, best.x2, rows[0][1]]);
    const splitY = Math.round(best.y - 0.12*best.unit);
    const [ix,iy,r] = profile.icon;
    const iconSource = clamp([best.x+(ix-r)*best.unit, best.y+(iy-r)*best.unit, best.x+(ix+r)*best.unit, best.y+(iy+r)*best.unit]);
    function locateHeader(searchBox, includeIcon = false) {
      const b = clamp(searchBox), canvas = new OffscreenCanvas(b[2]-b[0], b[3]-b[1]);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(bitmap, b[0], b[1], canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      const found = findRegionBounds(context.getImageData(0, 0, canvas.width, canvas.height).data,
        canvas.width, canvas.height, best.unit, true);
      let box = found ? [b[0]+found.left, b[1]+found.top, b[0]+found.right, b[1]+found.bottom] : b;
      if (includeIcon) box = [Math.min(box[0], iconSource[0]), Math.min(box[1], iconSource[1]),
        Math.max(box[2], iconSource[2]), Math.max(box[3], iconSource[3])];
      return { box: clamp(box), method: found ? "detected" : "profile" };
    }
    const name = locateHeader([header[0], header[1], header[2], splitY], true);
    // Restrict COST to the left text block, excluding the action-key icons on the right.
    const cost = locateHeader([header[0], splitY, header[0]+(header[2]-header[0])*0.38, header[3]]);
    const headers = data.splitHeader ? [name.box, cost.box] : [header];
    const crops = [...headers, ...rows];
    const methods = [...(data.splitHeader ? [name.method, cost.method] : ["profile"]),
      ...detected.map(row => row ? "detected" : "profile")];
    if (crops.some(b => b[2] <= b[0] || b[3] <= b[1])) throw new Error("에코 영역이 잘려 있습니다.");
    // Preserve panel-relative X alignment for stat/icon image matching, while OCR
    // reads each band's own left/right bounds.
    const atlasLeft = Math.min(probeBox[0], ...crops.map(b => b[0]));
    const atlasRight = Math.max(probeBox[2], ...crops.map(b => b[2]));
    const factor = Math.min(1, 800/(atlasRight-atlasLeft));
    const sizes = crops.map(b => [Math.round((b[2]-b[0])*factor), Math.round((b[3]-b[1])*factor)]);
    const atlas = new OffscreenCanvas(Math.ceil((atlasRight-atlasLeft)*factor)+32, sizes.reduce((sum,s) => sum+s[1]+32, 0));
    const out = atlas.getContext("2d"); out.fillStyle = "#14181e"; out.fillRect(0, 0, atlas.width, atlas.height);
    const bands = []; let y = 16;
    crops.forEach((b,index) => {
      const left = 16+Math.round((b[0]-atlasLeft)*factor);
      out.drawImage(bitmap, b[0], b[1], b[2]-b[0], b[3]-b[1], left, y, sizes[index][0], sizes[index][1]);
      const source = [Math.floor(b[0]*originalWidth/w), Math.floor(b[1]*originalHeight/h),
        Math.ceil(b[2]*originalWidth/w), Math.ceil(b[3]*originalHeight/h)];
      bands.push({ index: index-headers.length, left, right: left+sizes[index][0], top: y,
        bottom: y+sizes[index][1], source, method: methods[index] }); y += sizes[index][1]+32;
    });
    const icon = [16+(iconSource[0]-atlasLeft)*factor, 16+(iconSource[1]-headers[0][1])*factor,
      16+(iconSource[2]-atlasLeft)*factor, 16+(iconSource[3]-headers[0][1])*factor].map(Math.round);
    const blob = await atlas.convertToBlob({ type: "image/png" });
    self.postMessage({ blob, metadata: { version: 1, width: atlas.width, height: atlas.height, bands, icon,
      sourceWidth: originalWidth, sourceHeight: originalHeight } });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "이미지 전처리에 실패했습니다." });
  } finally {
    bitmap?.close();
    for (const mat of mats.reverse()) mat.delete();
  }
};
