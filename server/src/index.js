/* 
  Main entry point for the CipherSQLStudio Backend.
  Initializes the Express server and core middleware.
*/

import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectPostgres } from "./config/postgres.js";
import { connectMongoDB } from "./config/mongodb.js";
import assignmentsRouter from "./routes/assignments.routes.js";
import queryRoutes from "./routes/query.routes.js"

// express app instance
const app = express();


// middleware
app.use(cors());  // CROSS ORIGIN RESOURCE SHARING: since frontend is running at differen "origin" (port here) than backend 
app.use(express.json()); // listen to the streamed chunks and convert them into singal JSON object.
app.use("/assignments", assignmentsRouter); // mounting the modular ROUTER of "/assignments" routes.
app.use("/execute", queryRoutes)

// Route Handler - with get method
app.get("/", (req, res) => {
  res.json({ message: "CipherSQLStudio API  server is running" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to databases...");
    
    // We run these in parallel to save time on startup
    await Promise.all([
      connectMongoDB(),
      connectPostgres()
    ]);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection issues:", error);
    process.exit(1);
  }
};

startServer()