import { pgPool } from "../config/postgres.js";
import { getAssignmentDetail } from "../repositories/assignments.repository.js";

/**
 * [ SQL Sandbox ]:
 * Instead of running a user's query against your real, permanent database, 
 * { 
     BEGIN
     ROLLBACK
    }
 * - creates a "fake" environment on the fly -> runs the user's code, gets the result -> and then wipes everything clean.
 */

export const executeQuery = async (assignmentId, userQuery) => {
  const client = await pgPool.connect();

  try {
    const assignment = await getAssignmentDetail(assignmentId);  // fetch the details of selected Assignment

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const { sampleTables } = assignment;   // destructure the sampleTables

    // Starting the SQL transaction
    await client.query("BEGIN");

    // Create tables
    for (const table of sampleTables) {
      const columns = table.columns
        .map((c) => `${c.columnName} ${c.dataType}`)
        .join(", ");

      const createTableSQL = `CREATE TEMP TABLE ${table.tableName} (${columns});`;

      await client.query(createTableSQL);

      // Insert rows
      for (const row of table.rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);

        const placeholders = keys.map((_, i) => `$${i + 1}`).join(",");

        const insertSQL = `
          INSERT INTO ${table.tableName} (${keys.join(",")})
          VALUES (${placeholders});
        `;

        await client.query(insertSQL, values); 
      }
    }

    // Execute user query
    const result = await client.query(userQuery);

    // Reverting the Database back to STATE before this transaction
    await client.query("ROLLBACK");

    return result.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release database connection back to Pool for next request - prevent connection exhaustion 
    client.release();
  }
};