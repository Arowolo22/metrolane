import axios from "axios";

export type ApiErrorKind =
  | "network"
  | "server"
  | "badRequest"
  | "unauthorized"
  | "forbidden"
  | "notFound"
  | "conflict"
  | "validation"
  | "rateLimited"
  | "unknown";

export type ErrorStatusCopy = {
  title: string;
  description: string;
  actionLabel?: string;
};

export type ResilienceErrorOptions = {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
  errorId?: string;
  cause?: unknown;
};

export class ResilienceError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly fieldErrors?: Record<string, string[]>;
  readonly retryable: boolean;
  readonly errorId: string;

  constructor(options: ResilienceErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "ResilienceError";
    this.kind = options.kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.retryable = options.retryable ?? isRetryableKind(options.kind);
    this.errorId = options.errorId ?? createErrorId();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const STATUS_COPY: Record<ApiErrorKind, ErrorStatusCopy> = {
  network: {
    title: "You’re offline",
    description:
      "Check your internet connection. We’ll retry when you’re back online.",
    actionLabel: "Try again",
  },
  server: {
    title: "The service is unavailable",
    description:
      "We couldn’t load this view right now. Please try again in a moment.",
    actionLabel: "Retry",
  },
  badRequest: {
    title: "We couldn’t process that request",
    description: "Review the information and try again.",
    actionLabel: "Try again",
  },
  unauthorized: {
    title: "Your session has expired",
    description:
      "Sign in again to continue. Your saved work will remain protected.",
    actionLabel: "Sign in again",
  },
  forbidden: {
    title: "Access denied",
    description: "You don’t have permission to view this content.",
    actionLabel: "Go back",
  },
  notFound: {
    title: "We couldn’t find that page",
    description: "The record may have moved or the link may be out of date.",
    actionLabel: "Back to records",
  },
  conflict: {
    title: "This record already exists",
    description:
      "Use a different session or update the existing record instead.",
    actionLabel: "Review details",
  },
  validation: {
    title: "Some information needs attention",
    description: "Check the highlighted fields and try again.",
    actionLabel: "Review fields",
  },
  rateLimited: {
    title: "Too many requests",
    description: "Please wait a moment before trying again.",
    actionLabel: "Try again",
  },
  unknown: {
    title: "Something went wrong",
    description:
      "We couldn’t complete that request. Please try again or contact support.",
    actionLabel: "Retry",
  },
};

function createErrorId(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `ML-${suffix}`;
}

function isRetryableKind(kind: ApiErrorKind): boolean {
  return (
    kind === "network" ||
    kind === "server" ||
    kind === "rateLimited" ||
    kind === "unknown"
  );
}

function getStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.status;
}

function isOfflineNetworkError(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    return true;
  if (!axios.isAxiosError(error)) return false;

  if (error.response) return false;

  return (
    error.code === "ERR_NETWORK" ||
    error.code === "ECONNABORTED" ||
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("timeout")
  );
}

function kindFromStatus(status?: number): ApiErrorKind {
  if (!status) return "unknown";
  if (status >= 500) return "server";
  switch (status) {
    case 400:
      return "badRequest";
    case 401:
      return "unauthorized";
    case 403:
      return "forbidden";
    case 404:
      return "notFound";
    case 409:
      return "conflict";
    case 422:
      return "validation";
    case 429:
      return "rateLimited";
    default:
      return "unknown";
  }
}

function getFieldErrors(error: unknown): Record<string, string[]> | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data;
  if (!data || typeof data !== "object" || !("errors" in data))
    return undefined;
  const errors = data.errors;
  return errors && typeof errors === "object"
    ? (errors as Record<string, string[]>)
    : undefined;
}

export function getStatusCopy(kind: ApiErrorKind): ErrorStatusCopy {
  return STATUS_COPY[kind];
}

export function classifyApiError(
  error: unknown,
  fallback = "We couldn’t complete that request.",
): ResilienceError {
  if (error instanceof ResilienceError) return error;

  const status = getStatus(error);
  const kind = isOfflineNetworkError(error)
    ? "network"
    : kindFromStatus(status);
  const copy = STATUS_COPY[kind];

  const message =
    kind === "network"
      ? "The backend could not be reached. Please check that the Render service is running and try again."
      : kind === "unknown"
        ? fallback
        : copy.description;

  return new ResilienceError({
    kind,
    status,
    fieldErrors: getFieldErrors(error),
    message,
    cause: error,
  });
}

export function isAuthError(error: unknown): boolean {
  return classifyApiError(error).kind === "unauthorized";
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return classifyApiError(error, fallback).message;
}
