import puppeteer from "puppeteer";
import { assert } from "../../utils/common.js";
import { LUN_SELECTORS_OUTER, LUN_SELECTORS_INNER } from "./enums.js";
import { grabTextContent } from "../../utils/common.js";

export async function collectPrices(page: puppeteer.Page) {
	await page.waitForSelector(LUN_SELECTORS_INNER.price, {
		visible: true,
	});
	const prices = await page.$$eval(LUN_SELECTORS_INNER.price, (elements) =>
		elements.map((element) => element.textContent),
	);
	return prices;
}

export async function collectAddresses(page: puppeteer.Page) {
	await page.waitForSelector(LUN_SELECTORS_OUTER.address, {
		visible: true,
	});
	const addresses = await page.$$eval(
		LUN_SELECTORS_OUTER.address,
		(elements) => elements.map((element) => element.textContent),
	);
	return addresses;
}

export async function collectDates(page: puppeteer.Page) {
	await page.waitForSelector(LUN_SELECTORS_OUTER.dates, {
		visible: true,
	});
	const dates = await page.$$eval(LUN_SELECTORS_OUTER.dates, (elements) =>
		elements.map((element) => element.textContent),
	);

	const updated: string[] = [];
	const created: string[] = [];
	dates.forEach((item, index) => {
		if (index % 2 === 0) {
			assert(item);
			updated.push(item);
		} else {
			assert(item);
			created.push(item);
		}
	});

	return { updated, created };
}

export async function collectDescriptions(page: puppeteer.Page) {
	const parentSelector = ".realty-preview-description-wrapper";
	const childSelector = ".realty-preview-description__text";
	await page.waitForSelector(parentSelector, {
		visible: true,
	});

	const parentElements = await page.$$(parentSelector);
	const descriptions: string[] | null = [];
	// Process each parent element
	for (const parentElement of parentElements) {
		const childElement = await parentElement.$(childSelector);

		if (childElement) {
			const childText = await childElement.evaluate(
				(node) => node!.textContent,
			);
			// console.log("Child found:", childText);
			assert(childText);
			descriptions.push(childText);
		} else {
			// console.log("No child found in this parent element");
			descriptions.push("no description");
		}
	}

	return descriptions;
}

export async function collectPhotos(page: puppeteer.Page) {
	const imageLinks: string[] = [];

	// Check if the "Show All Photos" button is present
	const showAllPhotosButton = await page.$(
		LUN_SELECTORS_INNER.showAllPhotosButton,
	);
	if (showAllPhotosButton) {
		await showAllPhotosButton.click();
		console.log("Show all photos button - PRESENT");
	} else {
		console.log("Show all photos button - NOT FOUND");
		return imageLinks;
	}
	await page.locator(LUN_SELECTORS_INNER.fullscreenPhotosModal).scroll({
		scrollTop: 10000,
	});
	const divsWithPhotos = await page.$$(LUN_SELECTORS_INNER.divsWithPhotos);

	// Iterate over each div element
	for (const divHandle of divsWithPhotos) {
		// Use evaluate to interact with the DOM inside the divHandle
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

export const collectPhoneNumber = async (
	page: puppeteer.Page,
	selector: string,
) => {
	const isContactButtonText = (text: string) => {
		return text === "Дивитись контакти" || text === "Смотреть контакты";
	};

	let buttonContent = await grabTextContent(page, selector);
	assert(buttonContent);
	if (isContactButtonText(buttonContent)) {
		// console.log("Номера нету, инфа с другого сайта");
		return "Номера нету, инфа с другого сайта";
	}

	await page.locator(selector).click();

	// Wait for the phone number to be revealed and then grab the content again
	buttonContent = await grabTextContent(page, selector);
	// console.log("Номер есть: ", buttonContent);

	return buttonContent;
};

export async function clickOnListings(page: puppeteer.Page) {
	// Wait for all listing elements to be visible
	await page.waitForSelector(LUN_SELECTORS_OUTER.linkToListing);

	// Get all listing elements
	const listingElements = await page.$$(LUN_SELECTORS_OUTER.linkToListing);

	// Iterate over each listing element and click
	for (let listingElement of listingElements) {
		await listingElement.click();
	}
}
