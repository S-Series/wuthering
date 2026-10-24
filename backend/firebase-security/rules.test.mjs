import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

test("game profiles are owner-only and all other paths are denied", async () => {
  const env = await initializeTestEnvironment({ projectId: "demo-wuwa-security",
    firestore: { host: "127.0.0.1", port: 8085, rules: await readFile(new URL("../../firestore.rules", import.meta.url), "utf8") } });
  try {
    const owner = env.authenticatedContext("alice").firestore();
    const other = env.authenticatedContext("bob").firestore();
    const anon = env.unauthenticatedContext().firestore();
    await assertSucceeds(setDoc(doc(owner, "gameProfiles/alice"), { uid: "alice" }));
    await assertSucceeds(getDoc(doc(owner, "gameProfiles/alice")));
    await assertSucceeds(setDoc(doc(owner, "gameProfiles/alice"), { gameLevel: 90 }, { merge: true }));
    for (const db of [other, anon]) {
      await assertFails(getDoc(doc(db, "gameProfiles/alice")));
      await assertFails(setDoc(doc(db, "gameProfiles/alice"), { gameLevel: 1 }));
      await assertFails(deleteDoc(doc(db, "gameProfiles/alice")));
    }
    await assertFails(getDocs(collection(owner, "gameProfiles")));
    await assertFails(setDoc(doc(owner, "otherCollection/alice"), {}));
    await assertFails(setDoc(doc(owner, "gameProfiles/alice/nested/data"), {}));
    await assertSucceeds(deleteDoc(doc(owner, "gameProfiles/alice")));
  } finally { await env.cleanup(); }
});
