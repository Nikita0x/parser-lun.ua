import { Currency, Order } from "../modules/lun/enums.js";
export const LUN_BASE_URL = `https://lun.ua/uk/search`;
const currency = Currency.UAH;
const order = Order.ASCENDING;
export const viewport = { width: 1024, height: 1024 };
export const browserLaunchOptions = {
    headless: false,
    slowMo: 8,
};
export const pagesToParse = 20;
export const PAGE_PARAMS = {
    currency,
    geo_id: "10009580",
    has_eoselia: "false",
    is_without_fee: "false",
    price_sqm_currency: currency,
    section_id: "2",
    sort: `price-${order}`,
};
