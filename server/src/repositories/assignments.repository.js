import fs from "fs/promises";
import path from "path";
/*
 * Repository layer acts as the interface btw Database and Domain - handle database access.
 */

const datasetPath = path.resolve(process.cwd(), "../data/CipherSqlStudio-assignment.json"); // generating the absolute path

// Just a basic callback function to read the local JSON database.
const loadDataset = async () => {
  const data = await fs.readFile(datasetPath, "utf-8");
  return JSON.parse(data);
};


// Repository Method to get assignment summary.
export const getAssignmentSummaries = async () => {
  const assignments = await loadDataset();

  return assignments.map((asgn, index) => ({
    id: index + 1,  // dynamically creating the Id - based on indexed position
    title: asgn.title,
    difficulty: asgn.description,
  }));
};

// Repository method to get assigment details of assignment with specified ID.
export const getAssignmentDetail = async (id) => {
  const assignments = await loadDataset();

  const index = Number(id) - 1;
  const assignment = assignments[index];

  if (!assignment) return null;

  return {   // creating assignment object
    id,
    title: assignment.title,
    difficulty: assignment.description,
    question: assignment.question,
    sampleTables: assignment.sampleTables,
  };
};