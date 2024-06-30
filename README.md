## lun.ua Parser

Пет проект - парсер сайта lun.ua

<summary>Пример объекта</summary>

<details>

```json
{
	"price": "6 500 грн",
	"details": [
		"1 кімната",
		"35 / 18 / 7 м²",
		"поверх 4 з 5",
		"хрущівка",
		"централізоване Опалення",
		"1962 Рік будівництва",
		"цегляний будинок",
		"Знайдено 27 червня",
		"Оновлено 28 червня"
	],
	"description": "Подольский р-н Ветряные Горы ул Краснопольская  дивон, стол, сервант, шкаф, балкон застеклен, санузел совмещен, газовая плита, жилое состояние, рядом магазины, тихое место, для семейной пары, без животных, 6500грн плюс коммунальные",
	"address": "вул. Червонопільська, ",
	"photos": [
		"https://lunappimg.appspot.com/lun-ua/488/365/images/1027990934.jpg",
		"https://lunappimg.appspot.com/lun-ua/487/365/images/1027990932.jpg",
		"https://lunappimg.appspot.com/lun-ua/488/366/images/1027990936.jpg",
		"https://lunappimg.appspot.com/lun-ua/488/366/images/1027990935.jpg",
		"https://lunappimg.appspot.com/lun-ua/546/366/images/1027990933.jpg"
	],
	"phone": "+38 0** *** ** **",
	"url": "https://lun.ua/realty/1489799563"
}
```

</details>

## Tech

-   Node.js
-   Puppeteer

## Installation

```js
npm install
npm run test
```

После окончания скрипта, получаем json файл в папке `lun-parser/json`
