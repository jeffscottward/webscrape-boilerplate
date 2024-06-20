/**
 * This file schedules the scraping tasks to run at regular intervals.
 * It also provides an option to run the scraping tasks immediately for testing.
 * It uses node-schedule to trigger the scraping function for both JSON and webpage sources.
 */

import schedule from "node-schedule";
import fetchMortgageInfo from "./scraper-json";
import fetchMortgageInfoFromWebpage from "./scraper-webpage";
import logger from "./logger";

// Check if the script is run with the --run-now argument
const runNow = process.argv.includes("--run-now");

// Function to run scraping tasks immediately
const runScrapingTasks = async () => {
  logger.info("Starting immediate JSON scraping task");
  await fetchMortgageInfo();
  logger.info("Finished immediate JSON scraping task");

  logger.info("Starting immediate webpage scraping task");
  await fetchMortgageInfoFromWebpage();
  logger.info("Finished immediate webpage scraping task");
};

// Schedule the JSON scraping task to run every day at midnight
schedule.scheduleJob("0 0 * * *", async () => {
  logger.info("Starting scheduled JSON scraping task");
  await fetchMortgageInfo();
  logger.info("Finished scheduled JSON scraping task");
});

// Schedule the webpage scraping task to run every day at 1 AM
schedule.scheduleJob("0 1 * * *", async () => {
  logger.info("Starting scheduled webpage scraping task");
  await fetchMortgageInfoFromWebpage();
  logger.info("Finished scheduled webpage scraping task");
});

// Run scraping tasks immediately if --run-now argument is provided
if (runNow) {
  runScrapingTasks().catch((error) => {
    logger.error("Error during immediate scraping", { error });
  });
}
