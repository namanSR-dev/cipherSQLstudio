/* 
  Main entry point for the CipherSQLStudio Backend.
  Initializes the Express server and core middleware.
*/

import express from "express";
import cors from "cors";
import "dotenv/config";

// express app instance
const app = express();


// middleware
app.use(cors());  // CROSS ORIGIN RESOURCE SHARING: since frontend is running at differen "origin" (port here) than backend 
app.use(express.json()); // listen to the streamed chunks and convert them into singal JSON object.

// Route Handler - with get method
app.get("/", (req, res) => {
  res.json({ message: "CipherSQLStudio API  server is running" });
});

const PORT = process.env.PORT || 5000;

// application start listening to specified port - simply say "running of given port"
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});