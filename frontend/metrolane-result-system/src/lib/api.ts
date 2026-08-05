import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

import { classifyApiError, getErrorMessage } from "@/lib/apiErrors"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export type ApiEnvelope<T> = {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

const ACCESS_TOKEN_KEY = "metrolane.auth.accessToken"
const REFRESH_TOKEN_KEY = "metrolane.auth.refreshToken"
export const AUTH_EXPIRED_EVENT = "metrolane:auth-expired"

let refreshPromise: Promise<string | null> | null = null

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function notifyAuthExpired(): void {
  clearAuthTokens()
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  refreshPromise = axios
    .post<ApiEnvelope<{ accessToken: string; refreshToken?: string }>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
    )
    .then(({ data }) => {
      if (!data.success || !data.data?.accessToken) return null
      setAuthTokens(data.data.accessToken, data.data.refreshToken)
      return data.data.accessToken
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

function canRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? ""
  return !url.includes("/auth/login") && !url.includes("/auth/refresh")
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      originalRequest &&
      canRefreshRequest(originalRequest) &&
      !originalRequest.headers?.["x-auth-retried"]
    ) {
      const nextAccessToken = await refreshAccessToken()
      if (nextAccessToken) {
        originalRequest.headers["x-auth-retried"] = "true"
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
        return apiClient(originalRequest)
      }

      notifyAuthExpired()
    }

    return Promise.reject(classifyApiError(error))
  },
)

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return getErrorMessage(error, fallback)
}
