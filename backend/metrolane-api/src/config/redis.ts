import IORedis from "ioredis"

const RedisCtor = IORedis as unknown as new (
  port: string,
  options?: Record<string, unknown>,
) => {
  connect(): Promise<void>
  get(key: string): Promise<string | null>
  set(key: string, value: string, ...args: unknown[]): Promise<unknown>
  del(key: string): Promise<number>
}

import { env } from "./env.js"

type MemoryEntry = { value: string; expiresAt?: number }

class MemoryStore {
  private store = new Map<string, MemoryEntry>()

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value
  }

  async set(key: string, value: string, mode?: "EX", ttl?: number): Promise<void> {
    const expiresAt = mode === "EX" && ttl ? Date.now() + ttl * 1000 : undefined
    this.store.set(key, { value, expiresAt })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }
}

export type CacheClient = {
  get(key: string): Promise<string | null>
  set(key: string, value: string, mode?: "EX", ttl?: number): Promise<void>
  del(key: string): Promise<void>
}

let cacheClient: CacheClient | null = null

export async function connectRedis(): Promise<CacheClient> {
  if (cacheClient) return cacheClient

  if (env.REDIS_URL) {
    const redis = new RedisCtor(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    try {
      await redis.connect()
      console.log("Redis connected")
      cacheClient = {
        get: (key) => redis.get(key),
        set: async (key, value, mode, ttl) => {
          if (mode === "EX" && ttl) {
            await redis.set(key, value, "EX", ttl)
          } else {
            await redis.set(key, value)
          }
        },
        del: (key) => redis.del(key).then(() => undefined),
      }
      return cacheClient
    } catch (error) {
      console.warn("Redis unavailable, using in-memory store:", error)
    }
  } else {
    console.warn("REDIS_URL not set — using in-memory store for sessions/tokens")
  }

  cacheClient = new MemoryStore()
  return cacheClient
}

export function getCache(): CacheClient {
  if (!cacheClient) {
    throw new Error("Cache not initialized. Call connectRedis() first.")
  }
  return cacheClient
}
