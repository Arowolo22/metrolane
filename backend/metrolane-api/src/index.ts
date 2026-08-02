import "dotenv/config"

import { createApp } from "./app.js"
import { env } from "./config/env.js"
import { connectRedis } from "./config/redis.js"
import { verifySupabaseConnection } from "./config/supabase.js"

async function bootstrap() {
  await verifySupabaseConnection()
  await connectRedis()

  const app = createApp()

  app.listen(env.PORT, () => {
    console.log(`Metrolane API running on http://localhost:${env.PORT}`)
  })
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})
