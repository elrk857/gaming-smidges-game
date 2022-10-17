import { test, BrowserContext, Page } from '@playwright/test';

test.describe.serial('Gaming Smidge\'s game', () => {
    let page: Page;
    let context: BrowserContext;
    let colourData;
    let smidgesCanvas;
    let myHack;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext(); 
        page = await context.newPage();
        await page.waitForTimeout(2000);
        await page.goto('https://samuelmidgley.github.io/portfolio/games/cssgame');
    });

    async function createRgbText(data) {
        return `rgb(${data[0]}, ${data[1]}, ${data[2]})`
    }

    async function rgbToHex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return ("#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
    }

    test('Play game', async() => {
        test.setTimeout(12000000)
        await page.waitForTimeout(1000)

        let f: boolean = true
        let i: number = -1;
        let correctAnswer: string;

        while(f) {
            colourData = await page.evaluate(() => {
                smidgesCanvas = document.querySelectorAll('canvas')[0];
                myHack = document.createElement("canvas");
                myHack.width = smidgesCanvas.width;
                myHack.height = smidgesCanvas.height;
                myHack.getContext('2d').drawImage(smidgesCanvas, 0, 0, smidgesCanvas.width, smidgesCanvas.height)
                return myHack.getContext('2d').getImageData(100, 100, 1, 1).data; 
            });
            correctAnswer = await createRgbText(colourData)
            if (i % 4 === 0 && i > 0) {
                correctAnswer = (await rgbToHex(correctAnswer));
            }
            console.log(correctAnswer)
            await page.locator(`text=${correctAnswer}`).click()
            i++
        }
    })
});