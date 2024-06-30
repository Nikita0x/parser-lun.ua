import fs from "node:fs";
import path from "path";
const __dirname = import.meta.dirname;
const dir = path.join(__dirname, "../json");
export function assert(value) {
    if (value === null || value === undefined) {
        throw new Error("value is not defined");
    }
}
export function createJSONfile(object, fileName) {
    const filePath = path.join(dir, `../json/${fileName}.json`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(object, null, 2));
}
export async function grabTextContent(page, selector) {
    try {
        const elementHandle = await page.waitForSelector(selector, {
            visible: true,
            timeout: 5000,
        });
        const textContent = await elementHandle?.evaluate((el) => {
            return el.textContent;
        });
        return textContent;
    }
    catch (error) {
        console.warn(`No elements with the selector: ${selector} found`);
        return "no data";
    }
}
export async function grabAllTextContents(page, selector) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout: 5000 });
        const elements = await page.$$(selector);
        const texts = await Promise.all(elements.map(async (element) => {
            return await element.evaluate((el) => {
                return el.textContent;
            });
        }));
        return texts;
    }
    catch (error) {
        console.warn(`No elements with the selector: ${selector} found`);
        return "no data";
    }
}
export function randomName(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
