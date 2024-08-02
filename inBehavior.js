// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';

/**
 * 
 * @param {String} pageUrl 页面url
 * @param {Object} launchOption launch配置
 * @param {ArrayFunction} customFunction 自定义方法-如fileChooser 给function传入page参数
 * @param {Number} clickEnd 页面点击几次结束
 */
exports.behaviorFn = async (pageUrl,launchOption,customFunction=[],clickEnd=15) => {
    let behavior = []
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch(launchOption);
        const page = await browser.newPage();
        // Navigate the page to a URL.
        await page.goto(pageUrl);
        // Set screen size.
        await page.setViewport({ width: 1920, height: 1080 });
        customFunction.forEach(async (fn) => {
            await fn(page)
        })
        // new Promise(async (resolve, reject) => {
        //     try {
        //         const [fileChooser] = await Promise.all([
        //             page.waitForFileChooser(),
        //         ]);
        //         await fileChooser.accept(['./交通道路.mp4']);
        //         resolve();
        //     } catch (error) {
        //         reject(error);
        //     }
        // })
        behavior = await page.evaluate(async (clickEnd) => {
            return new Promise((resolve, reject) => {
                let behavior = []
                let end = 0
                window.addEventListener('mousedown', function (e) {
                    behavior.push({
                        type: 'mousedown',
                        x: e.x,
                        y: e.y
                    })
                    end += 1
                    if (end == clickEnd) resolve(behavior)
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
        },{clickEnd})
        fs.writeFileSync('behavior.json', JSON.stringify(behavior));

        await browser.close();
    } catch (error) {
        console.log('error', error);
    }
}