/**
 * This file sets up a winston logger for logging messages and errors
 * throughout the scraping process.
 */
import winston from "winston";
// Create logger instance
const logger = winston.createLogger({
    level: "info", // Set log level to 'info'
    format: winston.format.json(), // Use JSON format for logs
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }), // Log errors to error.log
        new winston.transports.File({ filename: "combined.log" }), // Log all messages to combined.log
    ],
});
// If not in production, log to console as well
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(), // Use simple format for console logs
    }));
}
export default logger;
