import "dotenv/config"

import { createApp } from "./app.js"
import { configureCloudinary } from "./config/cloudinary.js"
import { connectDatabase } from "./config/database.js"
import { env } from "./config/env.js"
import { connectRedis } from "./config/redis.js"

async function bootstrap() {
  configureCloudinary()
  await connectDatabase()
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
