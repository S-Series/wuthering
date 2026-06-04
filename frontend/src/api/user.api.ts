import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfile } from "@/firebase/firebase";

type SyncGatewayUserInput = {
  displayName?: string | null;
  imageUrl?: string | null;
  provider?: string | null;
};

function normalizeProvider(providerId: string | undefined | null) {
  if (!providerId) return null;
  if (providerId === "password") return "email";
  if (providerId.endsWith(".com")) return providerId.replace(".com", "");
  return providerId;
}

export async function syncGatewayUser(
  user: FirebaseUser,
  input?: SyncGatewayUserInput
): Promise<UserProfile> {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

  if (!gatewayUrl) {
    throw new Error("VITE_GATEWAY_URL is missing");
  }

  const provider = user.providerData[0];
  const idToken = await user.getIdToken();

  const response = await fetch(`${gatewayUrl}/api/users/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      displayName:
        input?.displayName ??
        user.displayName ??
        provider?.displayName ??
        null,
      imageUrl:
        input?.imageUrl ??
        user.photoURL ??
        provider?.photoURL ??
        null,
      provider: input?.provider ?? normalizeProvider(provider?.providerId),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync gateway user: ${response.status}`);
  }

  return (await response.json()) as UserProfile;
}
