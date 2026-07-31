import axios, { type AxiosError } from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"

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
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
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
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          const { data } = await axios.post<ApiEnvelope<{
            accessToken: string
            refreshToken?: string
          }>>(`${API_BASE_URL}/auth/refresh`, { refreshToken })

          if (data.success && data.data?.accessToken) {
            setAuthTokens(data.data.accessToken, data.data.refreshToken)
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
            return apiClient(originalRequest)
          }
        } catch {
          clearAuthTokens()
        }
      }
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}
