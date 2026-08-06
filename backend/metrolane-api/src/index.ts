import "dotenv/config"

import { createApp } from "./app.js"
import { env } from "./config/env.js"
import { connectRedis } from "./config/redis.js"
import { verifySupabaseConnection } from "./config/supabase.js"

async function bootstrap() {
  await verifySupabaseConnection()
  await connectRedis()

  const app = createApp()
  const port = Number(process.env.PORT ?? env.PORT)

  app.listen(port, "0.0.0.0", () => {
    console.log(`Metrolane API running on port ${port}`)
  })
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})
