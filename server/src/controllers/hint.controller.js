import { generateHint } from "../services/hint.service.js";

/**
 * Controller for "/hint" route - utilizes the HINT generation service.
 */

export const getHint = async (req, res) => {
  try {
    const { assignmentId, query } = req.body;

    const hint = await generateHint(assignmentId, query);

    res.json({ hint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};