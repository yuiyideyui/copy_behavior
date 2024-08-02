// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';

; (async () => {
    let behavior = []
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();

        // Navigate the page to a URL.
        await page.goto('http://127.0.0.1:5503/html/test1.html');

        // Set screen size.
        await page.setViewport({ width: 1920, height: 1080 });
        // await page.mouse.click(942, 284);
        new Promise(async(resolve, reject) => {
            try {
                const [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                ]);
                await fileChooser.accept(['./交通道路.mp4']);
                console.log('上传了');
                resolve();
            } catch (error) {
                reject(error);
            }
        })
        behavior = await page.evaluate(async () => {
            return new Promise((resolve, reject) => {
                let behavior = []
                let end = 0
                window.addEventListener('mousedown', function (e) {
                    console.log('e', e, e.target);
                    behavior.push({
                        type: 'mousedown',
                        x: e.x,
                        y: e.y
                    })
                    end += 1
                    // resolve()
                    if (end == 15) resolve(behavior)
                })
                window.addEventListener('wheel', function (event) {
                    // 阻止默认滚动行为
                    event.preventDefault();
                    behavior.push({
                        type: 'wheel',
                        deltaY: event.deltaY
                    })
                    // 检测滚轮方向
                    if (event.deltaY < 0) {
                        console.log('向上滚动', event.deltaY);
                    } else {
                        console.log('向下滚动', event.deltaY);
                    }
                });
            });
        })
        fs.writeFileSync('behavior.json', JSON.stringify(behavior));

        await browser.close();
    } catch (error) {
        
        console.log('error',error);
    }
})();