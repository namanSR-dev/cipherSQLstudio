import express from "express";
import { getHint } from "../controllers/hint.controller.js";

const router = express.Router();

router.post("/", getHint);

export default router;