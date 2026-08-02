import { createClient } from "@supabase/supabase-js"

import { env } from "./env.js"

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

function isNonCriticalSupabaseError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "")
  const normalized = message.toLowerCase()

  return (
    normalized.includes("relation") ||
    normalized.includes("does not exist") ||
    normalized.includes("permission denied") ||
    normalized.includes("jwt") ||
    normalized.includes("network") ||
    normalized.includes("fetch failed") ||
    normalized.includes("failed to fetch")
  )
}

export function formatSupabaseError(error: unknown, context: string): Error {
  const message = error instanceof Error ? error.message : String(error ?? "")
  const normalized = message.toLowerCase()

  if (
    normalized.includes("permission denied") ||
    normalized.includes("does not exist") ||
    normalized.includes("relation")
  ) {
    return new Error(
      `${context}: ${message}. Run the SQL from backend/metrolane-api/supabase/migration.sql in the Supabase SQL Editor, then restart the backend.`,
    )
  }

  return new Error(`${context}: ${message}`)
}

export async function verifySupabaseConnection(): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from("users")
      .select("id", { head: true, count: "exact" })

    if (error) {
      if (env.NODE_ENV === "production" && !isNonCriticalSupabaseError(error)) {
        throw new Error(`Supabase connection check failed: ${error.message}`)
      }

      console.warn(`Supabase startup check skipped: ${error.message || "unknown Supabase error"}`)
      return
    }

    console.log("Supabase connected")
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (env.NODE_ENV === "production") {
      throw new Error(`Supabase connection check failed: ${message}`)
    }

    console.warn(`Supabase startup check skipped: ${message}`)
  }
}
