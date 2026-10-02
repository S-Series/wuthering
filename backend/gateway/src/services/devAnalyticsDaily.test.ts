import assert from "node:assert/strict";

process.env.SUPABASE_URL = "https://supabase.invalid";
process.env.SUPABASE_SECRET_KEY = "test-key";

const { dayInterval, latestCompletedDay, msUntilNextCollection, shiftDay } = await import("./devAnalyticsDaily.js");

assert.deepEqual(dayInterval("2026-10-01"), {
  start: "2026-09-30T20:00:00.000Z",
  end: "2026-10-01T20:00:00.000Z",
  queryEnd: "2026-10-01T19:59:59.999Z",
});
assert.equal(latestCompletedDay(new Date("2026-10-01T20:09:59.000Z")), "2026-09-30");
assert.equal(latestCompletedDay(new Date("2026-10-01T20:10:00.000Z")), "2026-10-01");
assert.equal(shiftDay("2026-10-01", -1), "2026-09-30");
assert.equal(msUntilNextCollection(Date.parse("2026-10-01T20:09:00.000Z")), 60_000);
assert.equal(msUntilNextCollection(Date.parse("2026-10-01T20:10:00.000Z")), 86_400_000);

console.log("Analytics KST day boundary checks passed");
