import { getAuth } from "firebase/auth";

type ClientEventName =
  | "page_view"
  | "card_download_clicked"
  | "card_preview_opened"
  | "profile_save_clicked"
  | "profile_load_clicked"
  | "membership_page_viewed"
  | "youtube_iframe_clicked";

type LogClientEventInput = {
  feature: string;
  eventName: ClientEventName;
  message?: string;
  meta?: Record<string, unknown>;
};

export async function logClientEvent(input: LogClientEventInput) {
  //const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;
  const gatewayUrl = "http://localhost:8080"

  if (!gatewayUrl) {
    console.warn("VITE_GATEWAY_URL is missing");
    return;
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const idToken = user ? await user.getIdToken() : null;

    await fetch(`${gatewayUrl}/api/client-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({
        feature: input.feature,
        eventName: input.eventName,
        message: input.message ?? null,
        meta: input.meta ?? {},
      }),
      keepalive: true,
    });
  } catch (error) {
    console.warn("[logClientEvent failed]", error);
  }
}