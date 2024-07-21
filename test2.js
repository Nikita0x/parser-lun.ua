import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
(async () => {
    const screenshotsDir = path.resolve(__dirname, "screenshots");
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 20,
    });
    await cluster.task(async ({ page, data: url }) => {
        try {
            await page.goto(url, { waitUntil: "networkidle2" });
            const screenshotName = url.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg";
            const screenshotPath = path.join(screenshotsDir, screenshotName);
            await page.screenshot({ path: screenshotPath });
            console.log(`Screenshot taken for ${url} and saved to ${screenshotPath}`);
        }
        catch (error) {
            console.error(`Failed to take screenshot of ${url}:`, error);
        }
    });
    for (let i = 0; i <= 99; i++) {
        console.log(`https://lun.ua/search?currency=UAH&geo_id=10009580&has_eoselia=false&is_without_fee=false&price_sqm_currency=UAH&section_id=2&sort=price-asc&page=${i}`);
        cluster.queue(`https://lun.ua/search?currency=UAH&geo_id=10009580&has_eoselia=false&is_without_fee=false&price_sqm_currency=UAH&section_id=2&sort=price-asc&page=${i}`);
    }
    await cluster.idle();
    await cluster.close();
})();
