import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import path from "path";
import { Page } from "puppeteer";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
	// Ensure screenshots directory exists
	const screenshotsDir = path.resolve(__dirname, "screenshots");
	if (!fs.existsSync(screenshotsDir)) {
		fs.mkdirSync(screenshotsDir);
	}

	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: 20,
	});

	// Define the task type
	type TaskData = {
		page: Page;
		data: string;
	};

	await cluster.task(async ({ page, data: url }: TaskData) => {
		try {
			await page.goto(url, { waitUntil: "networkidle2" }); // Ensure the page is fully loaded
			const screenshotName = url.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg"; // Create a unique filename
			const screenshotPath = path.join(screenshotsDir, screenshotName);
			await page.screenshot({ path: screenshotPath });
			console.log(
				`Screenshot taken for ${url} and saved to ${screenshotPath}`,
			);
		} catch (error) {
			console.error(`Failed to take screenshot of ${url}:`, error);
		}
	});

	// for (const url of BATCH_ONE) {
	// 	console.log(url);
	// 	cluster.queue(url);
	// }
	for (let i = 0; i <= 99; i++) {
		console.log(
			`https://lun.ua/search?currency=UAH&geo_id=10009580&has_eoselia=false&is_without_fee=false&price_sqm_currency=UAH&section_id=2&sort=price-asc&page=${i}`,
		);
		cluster.queue(
			`https://lun.ua/search?currency=UAH&geo_id=10009580&has_eoselia=false&is_without_fee=false&price_sqm_currency=UAH&section_id=2&sort=price-asc&page=${i}`,
		);
	}

	await cluster.idle();
	await cluster.close();
})();
