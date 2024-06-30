import { assert } from "../../utils/common.js";
import { LUN_SELECTORS_OUTER, LUN_SELECTORS_INNER } from "./enums.js";
import { grabTextContent } from "../../utils/common.js";
export async function collectPrices(page) {
    await page.waitForSelector(LUN_SELECTORS_INNER.price, {
        visible: true,
    });
    const prices = await page.$$eval(LUN_SELECTORS_INNER.price, (elements) => elements.map((element) => element.textContent));
    return prices;
}
export async function collectAddresses(page) {
    await page.waitForSelector(LUN_SELECTORS_OUTER.address, {
        visible: true,
    });
    const addresses = await page.$$eval(LUN_SELECTORS_OUTER.address, (elements) => elements.map((element) => element.textContent));
    return addresses;
}
export async function collectDates(page) {
    await page.waitForSelector(LUN_SELECTORS_OUTER.dates, {
        visible: true,
    });
    const dates = await page.$$eval(LUN_SELECTORS_OUTER.dates, (elements) => elements.map((element) => element.textContent));
    const updated = [];
    const created = [];
    dates.forEach((item, index) => {
        if (index % 2 === 0) {
            assert(item);
            updated.push(item);
        }
        else {
            assert(item);
            created.push(item);
        }
    });
    return { updated, created };
}
export async function collectDescriptions(page) {
    const parentSelector = ".realty-preview-description-wrapper";
    const childSelector = ".realty-preview-description__text";
    await page.waitForSelector(parentSelector, {
        visible: true,
    });
    const parentElements = await page.$$(parentSelector);
    const descriptions = [];
    for (const parentElement of parentElements) {
        const childElement = await parentElement.$(childSelector);
        if (childElement) {
            const childText = await childElement.evaluate((node) => node.textContent);
            assert(childText);
            descriptions.push(childText);
        }
        else {
            descriptions.push("no description");
        }
    }
    return descriptions;
}
export async function collectPhotos(page) {
    const imageLinks = [];
    await page.locator(LUN_SELECTORS_INNER.showAllPhotosButton).click();
    await page.locator(LUN_SELECTORS_INNER.fullscreenPhotosModal).scroll({
        scrollTop: 10000,
    });
    const divsWithPhotos = await page.$$(LUN_SELECTORS_INNER.divsWithPhotos);
    for (const divHandle of divsWithPhotos) {
        const src = await page.evaluate((div) => {
            const img = div.querySelector("img");
            if (img) {
                const link = img.getAttribute("src");
                return link;
            }
        }, divHandle);
        if (src) {
            imageLinks.push(src);
        }
    }
    return imageLinks;
}
export const collectPhoneNumber = async (page, selector) => {
    const isContactButtonText = (text) => {
        return text === "Дивитись контакти" || text === "Смотреть контакты";
    };
    let buttonContent = await grabTextContent(page, selector);
    assert(buttonContent);
    if (isContactButtonText(buttonContent)) {
        return "Номера нету, инфа с другого сайта";
    }
    await page.locator(selector).click();
    buttonContent = await grabTextContent(page, selector);
    return buttonContent;
};
export async function clickOnListings(page) {
    await page.waitForSelector(LUN_SELECTORS_OUTER.linkToListing);
    const listingElements = await page.$$(LUN_SELECTORS_OUTER.linkToListing);
    for (let listingElement of listingElements) {
        await listingElement.click();
    }
}
