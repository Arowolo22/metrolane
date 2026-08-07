import cors from "cors";
import express from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import resultRoutes from "./routes/result.routes.js";
import studentRecordsRoutes from "./routes/student-records.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { ok } from "./utils/apiResponse.js";

function getAllowedOrigins() {
  return env.FRONTEND_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-auth-retried"],
    }),
  );
  // The application-level CORS middleware handles preflight requests for every route.
  // Do not register `*` here: Express 5's path parser rejects the old wildcard syntax.
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json(ok({ status: "ok", timestamp: new Date().toISOString() }));
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/results", resultRoutes);
  app.use("/api/student-records", studentRecordsRoutes);
  app.use("/api/upload", uploadRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
