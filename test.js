import puppeteer from "puppeteer";
import { LUN_BASE_URL, PAGE_PARAMS, browserLaunchOptions, viewport, } from "./config/config.js";
import { clickOnListings, collectPhoneNumber, collectPhotos, } from "./modules/lun/collect.js";
import { LUN_SELECTORS_INNER } from "./modules/lun/enums.js";
import { assert, createJSONfile, grabAllTextContents, grabTextContent, randomName, } from "./utils/common.js";
(async () => {
    console.time("time for execution");
    let currentPage = 1;
    const finalListings = [];
    const browser = await puppeteer.launch(browserLaunchOptions);
    const page = await browser.newPage();
    await page.setViewport(viewport);
    browser.on("targetcreated", async (target) => {
        if (target.type() === "page") {
            const newPage = await target.page();
            assert(newPage);
            await newPage.bringToFront();
            await newPage.setViewport(viewport);
            const details = await grabAllTextContents(newPage, LUN_SELECTORS_INNER.details);
            const price = await grabTextContent(newPage, LUN_SELECTORS_INNER.price);
            const address = await grabTextContent(newPage, LUN_SELECTORS_INNER.address);
            const description = await grabTextContent(newPage, LUN_SELECTORS_INNER.description);
            const phone = await collectPhoneNumber(newPage, LUN_SELECTORS_INNER.showFullPhoneNumberButton);
            const photos = await collectPhotos(newPage);
            const url = newPage.url();
            const apartment = {
                price: price,
                details: details,
                description: description,
                address: address,
                photos: photos,
                phone: phone,
                url: url,
            };
            finalListings.push(apartment);
            console.log(apartment);
            await newPage.close();
        }
    });
    while (currentPage <= 1) {
        const urlParams = new URLSearchParams(PAGE_PARAMS);
        urlParams.set("page", currentPage.toString());
        const pageUrl = `${LUN_BASE_URL}?${urlParams.toString()}`;
        await page.goto(pageUrl);
        console.log("Current page: ", currentPage);
        await clickOnListings(page);
        currentPage++;
    }
    createJSONfile(finalListings, `new-json-${randomName(5)}`);
    console.timeEnd("time for execution");
    console.log("Done!");
    await browser.close();
})();
