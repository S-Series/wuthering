const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const getErrorName = (error: unknown): string | undefined => {
  if (error instanceof Error) return error.name;
  if (isRecord(error) && typeof error.name === "string") return error.name;
  return undefined;
};

export const isAbortError = (error: unknown): boolean => {
  return getErrorName(error) === "AbortError";
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }
  return String(error);
};
