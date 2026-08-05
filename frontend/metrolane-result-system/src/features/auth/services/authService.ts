import type {
  AuthResult,
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/features/auth/types"
import {
  apiClient,
  clearAuthTokens,
  getApiErrorMessage,
  setAuthTokens,
  type ApiEnvelope,
} from "@/lib/api"

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthResult> {
  try {
    const { data } = await apiClient.post<ApiEnvelope<AuthSession>>(
      "/auth/login",
      credentials,
    )

    if (!data.success || !data.data) {
      return { success: false, message: data.message ?? "Unable to sign in." }
    }

    setAuthTokens(data.data.accessToken, data.data.refreshToken)

    if (credentials.rememberMe) {
      sessionStorage.setItem("metrolane.auth.rememberMe", "true")
    } else {
      sessionStorage.removeItem("metrolane.auth.rememberMe")
    }

    return { success: true, user: data.data.user }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Unable to sign in. Please try again."),
    }
  }
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthResult> {
  try {
    const { data } = await apiClient.post<ApiEnvelope<AuthUser>>(
      "/auth/register",
      payload,
    )

    if (!data.success) {
      return {
        success: false,
        message: data.message ?? "Unable to create account.",
      }
    }

    return {
      success: true,
      message: data.message ?? "Account created successfully.",
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(
        error,
        "Unable to create account. Please try again.",
      ),
    }
  }
}

export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload,
): Promise<AuthResult> {
  try {
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      "/auth/forgot-password",
      payload,
    )

    if (!data.success) {
      return {
        success: false,
        message: data.message ?? "Unable to send reset link.",
      }
    }

    return { success: true, message: data.message }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(
        error,
        "Unable to send reset link. Please try again.",
      ),
    }
  }
}

export async function resetPasswordRequest(
  payload: ResetPasswordPayload,
): Promise<AuthResult> {
  try {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/reset-password",
      payload,
    )

    if (!data.success) {
      return {
        success: false,
        message: data.message ?? "Unable to reset password.",
      }
    }

    return {
      success: true,
      message: data.message ?? "Password updated successfully.",
    }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(
        error,
        "Unable to reset password. Please try again.",
      ),
    }
  }
}

export async function logoutRequest(): Promise<void> {
  const refreshToken = localStorage.getItem("metrolane.auth.refreshToken")
  try {
    await apiClient.post("/auth/logout", { refreshToken })
  } finally {
    clearAuthTokens()
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const { data } = await apiClient.get<ApiEnvelope<AuthUser>>("/auth/me")
  if (!data.success || !data.data) return null
  return data.data
}
