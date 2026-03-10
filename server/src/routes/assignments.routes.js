import express from "express";

/**
 * Modular Routes: keeping route logic in comman file - better scalability, maintainability and testing.
 */
import {
  fetchAssignments,
  fetchAssignmentById,
} from "../controllers/assignments.controller.js";

const router = express.Router();   // groups related routes together

router.get("/", fetchAssignments);
router.get("/:id", fetchAssignmentById);  // dynamic routes 

export default router;