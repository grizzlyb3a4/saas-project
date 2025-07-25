import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config(); // ⬅️ Load environment variables from .env

import { DataSource } from "typeorm";
import { VideoSchema } from "./entities/Video.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [VideoSchema],
  ssl: { rejectUnauthorized: false }, // ⬅️ Required for Neon
});
