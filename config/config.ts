import { Currency, Order } from "../modules/lun/enums.js";

export const LUN_BASE_URL = `https://lun.ua/uk/search`;
// валюта
const currency: Currency = Currency.UAH;
// сортировка (по-убываюнию, по-возростанию)
const order: Order = Order.ASCENDING;
//ширина, высота браузера в headless:false режиме
export const viewport = { width: 1024, height: 1024 };
// параметры запуска
export const browserLaunchOptions = {
	headless: false, //false - будет открывать браузер
	// slowMo: 50,
	// devtools: true,
};
// кол-во страниц которые будем парсить
export const pagesToParse = 1;

export const PAGE_PARAMS = {
	currency,
	geo_id: "10009580",
	has_eoselia: "false",
	is_without_fee: "false",
	price_sqm_currency: currency,
	section_id: "2",
	sort: `price-${order}`,
};
