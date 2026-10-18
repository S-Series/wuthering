import assert from "node:assert/strict";
process.env.SUPABASE_URL = "https://deadline-test.invalid";
process.env.SUPABASE_SECRET_KEY = "test-key";
process.env.SUPABASE_HTTP_TIMEOUT_MS = "10";
const { supabaseAdmin } = await import("./supabaseAdmin.js");
const originalFetch = globalThis.fetch;
let aborted = false;
let attempts = 0;
globalThis.fetch = async (_input, options) => {
  attempts++;
  const signal = options?.signal;
  assert.ok(signal);
  return new Promise<Response>((_resolve, reject) => {
    const fail = () => { aborted = true; reject(signal.reason); };
    if (signal.aborted) fail();
    else signal.addEventListener("abort", fail, { once: true });
  });
};
const keepAlive = setTimeout(() => { throw new Error("DB deadline did not fire"); }, 1000);
try {
  const result = await supabaseAdmin.from("users").select("id");
  assert.equal(aborted, true);
  assert.ok(result.error, "a stalled DB HTTP request must fail within the deadline");
  assert.equal(attempts, 1, "timeouts must not trigger the SDK's automatic network retries");
  aborted = false;
  const controller = new AbortController();
  controller.abort();
  await supabaseAdmin.from("users").select("id").abortSignal(controller.signal);
  assert.equal(aborted, true, "the caller's cancellation must be preserved");
  console.log("PASS: DB HTTP deadline and caller cancellation");
} finally {
  clearTimeout(keepAlive);
  globalThis.fetch = originalFetch;
}
