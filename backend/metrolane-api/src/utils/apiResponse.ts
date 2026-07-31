export type ApiSuccess<T> = {
  success: true
  data: T
  message?: string
}

export type ApiFailure = {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export function ok<T>(data: T, message?: string): ApiSuccess<T> {
  return { success: true, data, message }
}

export function fail(message: string, errors?: Record<string, string[]>): ApiFailure {
  return { success: false, message, errors }
}
