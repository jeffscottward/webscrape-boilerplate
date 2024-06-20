/**
 * This file contains the main scraping logic. It fetches mortgage information
 * from a JSON API, retries on failure, and inserts the data into an SQLite database.
 */
import axios from "axios";
import axiosRetry from "axios-retry";
import Bottleneck from "bottleneck";
import { insertMortgageInfo } from "./database";
import logger from "./logger";
import { formatISO } from "date-fns";
// Configure axios to retry requests on failure
axiosRetry(axios, { retries: 3 });
// Create a rate limiter to avoid overwhelming the server
const limiter = new Bottleneck({
    minTime: 200, // Minimum time between requests in milliseconds
});
// Define the API endpoint for mortgage information
const API_URL = "https://example.com/api/mortgage-info";
// Function to fetch and process mortgage information
const fetchMortgageInfo = async () => {
    try {
        // Fetch data from API
        const response = await limiter.schedule(() => axios.get(API_URL));
        // Extract mortgage information from response
        const mortgageInfo = response.data.mortgageInfo;
        // Process each mortgage entry
        for (const info of mortgageInfo) {
            const data = {
                property_id: info.propertyId,
                mortgage_rate: info.mortgageRate,
                mortgage_term: info.mortgageTerm,
                monthly_payment: info.monthlyPayment,
                scraped_at: formatISO(new Date()), // Current timestamp in ISO format
            };
            // Insert data into database
            insertMortgageInfo(data);
        }
        logger.info("Successfully fetched and processed mortgage information");
    }
    catch (error) {
        logger.error("Error fetching mortgage information", { error });
    }
};
export default fetchMortgageInfo;
