export function internalHeaders(service: "ocr" | "render"): Record<string, string> {
  const name = service === "ocr" ? "OCR_INTERNAL_SECRET" : "RENDER_INTERNAL_SECRET";
  const secret = process.env[name] ?? "";
  if (!/^[\x21-\x7e]{32,}$/.test(secret)) {
    throw new Error(`${name} must contain at least 32 printable ASCII characters without spaces`);
  }
  return { "X-Internal-Secret": secret };
}
