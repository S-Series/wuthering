import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const httpTimeoutMs = Number(process.env.SUPABASE_HTTP_TIMEOUT_MS ?? 10_000);

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing");
}

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing");
}
if (!Number.isSafeInteger(httpTimeoutMs) || httpTimeoutMs < 1) {
  throw new Error("SUPABASE_HTTP_TIMEOUT_MS must be a positive integer");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  global: {
    fetch: async (input, init) => {
      const timeout = AbortSignal.timeout(httpTimeoutMs);
      const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
      try {
        return await globalThis.fetch(input, {
          ...init,
          signal: callerSignal ? AbortSignal.any([callerSignal, timeout]) : timeout,
        });
      } catch (error) {
        // PostgREST retries network failures, including TimeoutError. Classify
        // deadline/caller cancellation as AbortError so it does not amplify load.
        if (timeout.aborted || callerSignal?.aborted) {
          throw new DOMException("Supabase HTTP request timed out or was cancelled", "AbortError");
        }
        throw error;
      }
    },
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
