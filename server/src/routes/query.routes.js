import express from "express";
import { runQuery } from "../controllers/query.controller.js";

/**
 * Route Handler for the "/execute" route.
 */

const router = express.Router();

router.post("/execute", runQuery);

export default router;