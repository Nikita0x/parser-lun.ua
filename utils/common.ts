import fs from "node:fs";
import path from "path";
import puppeteer, { Puppeteer } from "puppeteer";

// Define the directory and file path
const __dirname = import.meta.dirname;
const dir = path.join(__dirname, "../json");

/**
 * Asserts that a value is neither `null` nor `undefined`.
 *
 * This function serves as a type guard to inform the TypeScript compiler that
 * the provided value is defined, meaning it is neither `null` nor `undefined`.
 * If the value is `null` or `undefined`, an error is thrown.
 *
 * @template T - The type of the value being asserted.
 * @param {T | null | undefined} value - The value to assert.
 * @throws {Error} Throws an error if the value is `null` or `undefined`.
 */
export function assert<T>(value: T | null | undefined): asserts value is T {
	if (value === null || value === undefined) {
		throw new Error("value is not defined");
	}
}

/**
 * Creates a .json file in the /json directory.
 *
 * @param {object} object - Javascript object
 * @param {string} fileName - Name for the file
 */
export function createJSONfile(object: object, fileName: string) {
	const filePath = path.join(dir, `../json/${fileName}.json`);

	// Check if the directory exists
	if (!fs.existsSync(dir)) {
		// Create the directory if it does not exist
		fs.mkdirSync(dir, { recursive: true });
	}
	// Write the JSON file
	fs.writeFileSync(filePath, JSON.stringify(object, null, 2));
}

/**
 * Grabs text content by selector and returns it
 *
 * @param {object} page - page of the context
 * @param {string} selector - selector of the element to grab text from
 */
export async function grabTextContent(page: puppeteer.Page, selector: string) {
	try {
		const elementHandle = await page!.waitForSelector(selector, {
			visible: true,
			timeout: 5000,
		});
		const textContent = await elementHandle?.evaluate((el) => {
			return el.textContent;
		});
		return textContent;
	} catch (error) {
		console.warn(`No elements with the selector: ${selector} found`);
		return "no data";
	}
}

export async function grabAllTextContents(
	page: puppeteer.Page,
	selector: string,
) {
	try {
		// Wait for the selector to be present in the DOM
		await page.waitForSelector(selector, { visible: true, timeout: 5000 });

		// Select all elements matching the selector
		const elements = await page.$$(selector);

		// Extract and return the text content of each element
		const texts = await Promise.all(
			elements.map(async (element) => {
				return await element.evaluate((el) => {
					return el.textContent;
				});
			}),
		);

		return texts;
	} catch (error) {
		console.warn(`No elements with the selector: ${selector} found`);
		return "no data";
	}
}

/**
 * Generate random name
 *
 * @param {string} length - lenght of the generated name
 */
export function randomName(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
		counter += 1;
	}
	return result;
}
