# Webscrape Boilerplate

## Overview

This project is a boilerplate for web scraping both JSON APIs and webpages. It uses SQLite as the database for storing scraped mortgage information, and it employs modern libraries and best practices for robust and maintainable web scraping.

## Setup

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (version 14.x or above)
- pnpm (package manager)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/webscrape-boilerplate.git
    cd webscrape-boilerplate
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Create the SQLite database:

    ```bash
    pnpm createDB
    ```

## Usage

### Run Once Immediately

To run the scraping tasks immediately, use the `start:now` script:

```bash
pnpm start:now
```

This will compile the TypeScript code and execute the scraping tasks right away.

### Scheduled Scraping

By default, the scraping tasks are scheduled to run at specific intervals using `node-schedule`:

- JSON scraping task: scheduled to run every day at midnight.
- Webpage scraping task: scheduled to run every day at 1 AM.

To start the service with its scheduling:

```bash
pnpm start
```

### Project Structure

- `src/database.ts`: Sets up the SQLite database connection and provides functions to insert and retrieve mortgage information.
- `src/createDB.ts`: Initializes and exports the SQLite database instance.
- `src/index.ts`: Schedules the scraping tasks using `node-schedule` and provides an option to run them immediately.
- `src/logger.ts`: Configures the `winston` logger for logging messages and errors.
- `src/scraper-json.ts`: Fetches mortgage information from a JSON API, retries on failure, and inserts the data into the SQLite database.
- `src/scraper-webpage.ts`: Scrapes mortgage information from a webpage using Playwright and X-Ray, then inserts the data into the SQLite database.

### Configuration

The database is stored as `db/sqlite3.db` by default. Logging is configured to write error logs to `error.log` and all logs to `combined.log`.

### Customization

If you need to scrape different data or use another API, you can modify the following:

1. **API URL**: Change the `API_URL` in `src/scraper-json.ts` to point to your desired API.
2. **Webpage URL**: Change the `PAGE_URL` in `src/scraper-webpage.ts` to point to your target webpage.
3. **Data Structure**: Adjust the data extraction fields within `fetchMortgageInfo()` and `fetchMortgageInfoFromWebpage()` functions to match the structure of your source data.

### Logging

The project uses `winston` for logging:

- Errors are logged to `error.log`.
- All logs are combined and saved to `combined.log`.

Logs are also output to the console when the environment is not set to production.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests on the [GitHub repository](https://github.com/yourusername/webscrape-boilerplate).

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

This should get you started with the web scraping boilerplate. Customize it as needed, and happy scraping!