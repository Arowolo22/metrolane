import type {
  AuthResult,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/features/auth/types"

const SIMULATED_DELAY_MS = 900

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * Frontend-only placeholders. Replace with real API calls when the backend is ready.
 */
export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthResult> {
  await delay(SIMULATED_DELAY_MS)

  if (credentials.rememberMe) {
    // Placeholder for persistent session preference — wire to backend / secure storage later.
    sessionStorage.setItem("metrolane.auth.rememberMe", "true")
  } else {
    sessionStorage.removeItem("metrolane.auth.rememberMe")
  }

  return { success: true }
}

export async function registerRequest(
  _payload: RegisterPayload,
): Promise<AuthResult> {
  await delay(SIMULATED_DELAY_MS)
  return { success: true, message: "Account created successfully." }
}

export async function forgotPasswordRequest(
  _payload: ForgotPasswordPayload,
): Promise<AuthResult> {
  await delay(SIMULATED_DELAY_MS)
  return { success: true }
}

export async function resetPasswordRequest(
  _payload: ResetPasswordPayload,
): Promise<AuthResult> {
  await delay(SIMULATED_DELAY_MS)
  return { success: true, message: "Password updated successfully." }
}
