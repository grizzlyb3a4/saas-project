import "reflect-metadata";
import { AppDataSource } from "../src/data-source.js";

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to DB & synced schema");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error syncing DB:", err);
    process.exit(1);
  });
