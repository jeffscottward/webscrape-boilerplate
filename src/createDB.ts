/**
 * @file createDB.ts
 * @description Initializes and exports a SQLite database instance using better-sqlite3.
 */

import Database from "better-sqlite3";

// Initialize the database
const db = new Database("db/sqlite3.db", { verbose: console.log });

// Export db for usage in other files
export default db;
