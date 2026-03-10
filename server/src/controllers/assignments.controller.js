/*
 * Controller Layer : recieves client side REQUEST -> coordinate to appropriate RESPONSE.
 */

import {
  getAssignmentSummaries,
  getAssignmentDetail,
} from "../repositories/assignments.repository.js"

// controller to fetch assignment summary.
export const fetchAssignments = async (req, res) => {
  try {
    const assignments = await getAssignmentSummaries(); // call repository

    if (!assignments){  // Handle not Found Case
        return res.status(404).json({error: "No assignment present"})
    }
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to load assignments" });  // grace fully handle errors without crashing the server
  }
};

// controller to fetch details of assignment with given ID.
export const fetchAssignmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const assignment = await getAssignmentDetail(id);  // call repository

    if (!assignment) {     // Handle not Found Case
      return res.status(404).json({ error: `Assignment-${id} not found` });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to load assignment" }); // grace fully handle errors without crashing the server
  }
};