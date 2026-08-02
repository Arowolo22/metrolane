import argon2 from "argon2"

import { formatSupabaseError, supabaseAdmin } from "../config/supabase.js"

export type UserRole = "lecturer" | "admin"

export interface IUser {
  id: string
  firstName: string
  lastName: string
  department: string
  email: string
  phone: string
  passwordHash: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type UserRow = {
  id: string
  first_name: string
  last_name: string
  department: string
  email: string
  phone: string
  password_hash: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

const USERS_TABLE = "users"

function fromRow(row: UserRow): IUser {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    department: row.department,
    email: row.email,
    phone: row.phone,
    passwordHash: row.password_hash,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}

export async function verifyPassword(
  passwordHash: string,
  candidate: string,
): Promise<boolean> {
  return argon2.verify(passwordHash, candidate)
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  const { data, error } = await supabaseAdmin
    .from(USERS_TABLE)
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle()

  if (error) {
    throw formatSupabaseError(error, "Failed to look up user by email")
  }

  return data ? fromRow(data as UserRow) : null
}

export async function findUserById(id: string): Promise<IUser | null> {
  const { data, error } = await supabaseAdmin
    .from(USERS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw formatSupabaseError(error, "Failed to look up user by id")
  }

  return data ? fromRow(data as UserRow) : null
}

export async function createUser(input: {
  firstName: string
  lastName: string
  department: string
  email: string
  phone: string
  passwordHash: string
  role?: UserRole
}): Promise<IUser> {
  const { data, error } = await supabaseAdmin
    .from(USERS_TABLE)
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      department: input.department,
      email: input.email.toLowerCase(),
      phone: input.phone,
      password_hash: input.passwordHash,
      role: input.role ?? "lecturer",
    })
    .select("*")
    .single()

  if (error) {
    throw formatSupabaseError(error, "Failed to create user")
  }

  return fromRow(data as UserRow)
}

export async function updateUserPasswordHash(
  id: string,
  passwordHash: string,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from(USERS_TABLE)
    .update({ password_hash: passwordHash })
    .eq("id", id)

  if (error) {
    throw formatSupabaseError(error, "Failed to update password")
  }
}
