import puppeteer from "puppeteer";
import {
	LUN_BASE_URL,
	PAGE_PARAMS,
	browserLaunchOptions,
	viewport,
} from "./config/config.js";
import {
	clickOnListings,
	collectPhoneNumber,
	collectPhotos,
} from "./modules/lun/collect.js";
import { LUN_SELECTORS_INNER } from "./modules/lun/enums.js";
import { pagesToParse } from "./config/config.js";
import {
	assert,
	createJSONfile,
	grabAllTextContents,
	grabTextContent,
	randomName,
} from "./utils/common.js";
(async () => {
	console.time("time for execution");
	let currentPage: number = 1;
	const finalListings: object[] = [];

	const browser = await puppeteer.launch(browserLaunchOptions);
	const page = await browser.newPage();
	await page.setViewport(viewport);

	// Add a listener for the 'targetcreated' event
	browser.on("targetcreated", async (target) => {
		if (target.type() === "page") {
			const newPage = await target.page();
			assert(newPage);
			await newPage!.bringToFront(); // Focus the new tab
			await newPage!.setViewport(viewport);

			const details = await grabAllTextContents(
				newPage,
				LUN_SELECTORS_INNER.details,
			);

			type OrganizedDetails = {
				rooms: string;
				area: string;
				floor: string;
				type: string;
				heating: string;
				builtYear: string;
				material: string;
				foundDate: string;
				updatedDate: string;
				ceilingHeight: string;
			};

			const organizedDetails: OrganizedDetails = {
				rooms: "no data",
				area: "no data",
				floor: "no data",
				type: "no data",
				heating: "no data",
				builtYear: "no data",
				material: "no data",
				foundDate: "no data",
				updatedDate: "no data",
				ceilingHeight: "no data",
			};

			if (Array.isArray(details)) {
				details.forEach((item) => {
					assert(item);
					const roomsPattern = new RegExp("кімнат|комнат");
					if (roomsPattern.test(item)) {
						organizedDetails.rooms = item;
					}

					const areaPattern = new RegExp("м²");
					if (areaPattern.test(item)) {
						organizedDetails.area = item;
					}

					const floorPattern = new RegExp("этаж|поверх");
					if (floorPattern.test(item)) {
						organizedDetails.floor = item;
					}

					const typePattern = new RegExp(
						"аппс|аппс-люкс|бпс|чеський проєкт|гостинка|хрущівка|дореволюційний|совмін|серія|спец. проєкт|сталінка|аппс|аппс-люкс|бпс|чешский проект|гостинка|хрущевка|дореволюционный|совмин|серия|спец. проект|сталинка",
					);
					if (typePattern.test(item)) {
						organizedDetails.type = item;
					}

					const materialPattern = new RegExp(
						"блочні|монолітно-каркасний|панельні|утеплена панель|цегляний будинок|блочные|монолитно-каркасные|панельные|утепленная панель|кирпичные",
					);
					if (materialPattern.test(item)) {
						organizedDetails.material = item;
					}

					const builtYearPattern = new RegExp(
						/(\d{4})\s+(Рік будівництва|год постройки)/i,
					);
					if (builtYearPattern.test(item)) {
						const onlyYearPattern = /\b\d{4}\b/;
						const match = item.match(onlyYearPattern);
						if (match) {
							organizedDetails.builtYear = match[0];
						}
					}

					const ceilingHeightPattern = new RegExp(
						/высота потолка|висота стелі/i,
					);
					if (ceilingHeightPattern.test(item)) {
						organizedDetails.ceilingHeight = item;
					}

					const heatingPattern = /(отопление|опалення)/i;
					if (heatingPattern.test(item)) {
						organizedDetails.heating = item;
					}
				});
				console.log(organizedDetails);
			} else {
				console.log("No data available");
			}

			const price = await grabTextContent(
				newPage,
				LUN_SELECTORS_INNER.price,
			);

			const address = await grabTextContent(
				newPage,
				LUN_SELECTORS_INNER.address,
			);

			const description = await grabTextContent(
				newPage,
				LUN_SELECTORS_INNER.description,
			);

			const phone = await collectPhoneNumber(
				newPage,
				LUN_SELECTORS_INNER.showFullPhoneNumberButton,
			);

			const photos = await collectPhotos(newPage);
			const url = newPage.url();
			const apartment = {
				price: price,
				details: organizedDetails,
				description: description,
				address: address,
				photos: photos,
				phone: phone,
				url: url,
			};

			finalListings.push(apartment);
			// console.log(apartment);
			await newPage.close();

			// const furniture = await grabTextContent(newPage, detailsSelector);
			// console.log(furniture);
		}
	});

	while (currentPage <= pagesToParse) {
		const urlParams = new URLSearchParams(PAGE_PARAMS);
		urlParams.set("page", currentPage.toString());
		const pageUrl = `${LUN_BASE_URL}?${urlParams.toString()}`;
		await page.goto(pageUrl);
		console.log("Current page: ", currentPage);
		// console.log(pageUrl);

		await clickOnListings(page);
		currentPage++;
	}

	// input поле для поиска
	// await page.waitForSelector(LUN_SELECTORS_OUTER.searchInput);
	// await page.type(LUN_SELECTORS_OUTER.searchInput, inputSearchQuery);
	// await page.keyboard.press("Enter", {
	// 	delay: 1000,
	// });

	createJSONfile(finalListings, `new-json-${randomName(5)}`);

	console.timeEnd("time for execution");
	console.log("Done!");
	await browser.close();
})();
