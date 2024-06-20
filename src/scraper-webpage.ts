/**
 * @file scraper-webpage.ts
 * @description Scrapes mortgage information from a real estate sellers webpage using X-Ray and
 *              Playwright, then inserts the data into an SQLite database.
 */

import axios from "axios";
import axiosRetry from "axios-retry";
import Xray from "x-ray";
import { chromium } from "playwright";
import Bottleneck from "bottleneck";
import { insertMortgageInfo } from "./database";
import logger from "./logger";
import { formatISO } from "date-fns";

// Configure axios to retry requests on failure
axiosRetry(axios, { retries: 3 });

// Initialize X-Ray instance
const x = Xray();

// Create a rate limiter to avoid overwhelming the server
const limiter = new Bottleneck({
  minTime: 200, // Minimum time between requests in milliseconds
});

// Define the URL for the real estate sellers page
const PAGE_URL = "https://example.com/realestate";

// Function to fetch and process mortgage information from the webpage
const fetchMortgageInfoFromWebpage = async () => {
  try {
    // Launch Playwright browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the real estate sellers page
    await page.goto(PAGE_URL, { waitUntil: "networkidle" });

    // Extract the HTML content of the page
    const content = await page.content();

    // Close the browser
    await browser.close();

    // Scrape mortgage information using X-Ray
    const mortgageInfo = await x(content, ".property", [
      {
        property_id: ".property-id",
        mortgage_rate: ".mortgage-rate",
        mortgage_term: ".mortgage-term",
        monthly_payment: ".monthly-payment",
      },
    ]);

    // Process each mortgage entry
    for (const info of mortgageInfo) {
      const data = {
        property_id: info.property_id,
        mortgage_rate: parseFloat(info.mortgage_rate.replace("%", "")),
        mortgage_term: parseInt(info.mortgage_term.replace(" years", ""), 10),
        monthly_payment: parseFloat(info.monthly_payment.replace("$", "")),
        scraped_at: formatISO(new Date()), // Current timestamp in ISO format
      };

      // Insert data into database
      insertMortgageInfo(data);
    }

    logger.info(
      "Successfully fetched and processed mortgage information from webpage"
    );
  } catch (error) {
    logger.error("Error fetching mortgage information from webpage", { error });
  }
};

export default fetchMortgageInfoFromWebpage;
