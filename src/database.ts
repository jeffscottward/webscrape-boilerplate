/**
 * This file sets up the SQLite database connection and provides
 * functions to insert and retrieve mortgage information.
 */

import Database from "better-sqlite3";
import logger from "./logger";

// Initialize SQLite database
const db = new Database("db/sqlite3.db", { verbose: console.log });

// Create table for mortgage information if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS mortgage_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id TEXT,
    mortgage_rate REAL,
    mortgage_term INTEGER,
    monthly_payment REAL,
    scraped_at TEXT
  )
`);

// Function to insert mortgage information into the database
export const insertMortgageInfo = (info: {
  property_id: string;
  mortgage_rate: number;
  mortgage_term: number;
  monthly_payment: number;
  scraped_at: string;
}) => {
  const stmt = db.prepare(`
    INSERT INTO mortgage_info (property_id, mortgage_rate, mortgage_term, monthly_payment, scraped_at)
    VALUES (@property_id, @mortgage_rate, @mortgage_term, @monthly_payment, @scraped_at)
  `);

  try {
    stmt.run(info); // Insert data into database
    logger.info("Inserted mortgage info into database", { info });
  } catch (error) {
    logger.error("Error inserting mortgage info into database", { error });
  }
};
