// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';
const sleep = (time)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },time)
    })
}
; (async () => {
    let behavior = []
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            headless: 'new',
        });
        const page = await browser.newPage();

        // Navigate the page to a URL.
        await page.goto('http://127.0.0.1:96/');

        // Set screen size.
        await page.setViewport({ width: 1920, height: 1080 });
        new Promise(async(resolve, reject) => {
            try {
                const [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                ]);
                await fileChooser.accept(['./交通道路.mp4']);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
        const behavior = JSON.parse(fs.readFileSync('./behavior.json'));
        for(let i = 0; i<behavior.length; i++){
            let nowBe = behavior[i];
            if(nowBe.type == 'mousedown'){
               await page.mouse.click(nowBe.x,nowBe.y)
               await sleep(1000)
            }
            else if(nowBe.type == 'wheel'){
                await page.mouse.wheel({deltaY:nowBe.deltaY})
                await sleep(1000)
            }
        }

        await browser.close();
    } catch (error) {
        
        console.log('error',error);
    }
})();