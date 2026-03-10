import { executeQuery } from "../services/query.service.js";

/**
 * Controller for "/execute" route - utilizes the SANDBOXED query executer.
 */

export const runQuery = async (req, res) => {
  try {
    const { assignmentId, query } = req.body;

    const rows = await executeQuery(assignmentId, query);

    res.json({ rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};