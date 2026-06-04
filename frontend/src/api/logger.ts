import { getAuth } from "firebase/auth";

type ClientEventName =
  | "page_view"
  | "auth_login"
  | "auth_logout"
  | "auth_signup"
  | "auth_password_reset"
  | "image_download";

type LogResult = "success" | "fail";

type LogClientEventInput = {
  feature: string;
  eventName: ClientEventName;
  result?: LogResult;
  message?: string;
  statusCode?: number;
  durationMs?: number;
  meta?: Record<string, unknown>;
};

export async function logClientEvent(input: LogClientEventInput) {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

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
        result: input.result ?? "success",
        message: input.message ?? null,
        statusCode: input.statusCode ?? null,
        durationMs: input.durationMs ?? null,
        meta: input.meta ?? {},
      }),
      keepalive: true,
    });
  } catch (error) {
    console.warn("[logClientEvent failed]", error);
  }
}
