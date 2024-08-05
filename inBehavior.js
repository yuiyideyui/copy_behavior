// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';

/**
 * 按下Escape退出页面行为监听记录
 * @param {String} pageUrl 页面url
 * @param {Object} launchOption launch配置
 * @param {ArrayFunction} customFunction 自定义方法-如fileChooser 给function传入page参数
 * @param {String} outFilePath 输出文件路径
 */
exports.behaviorFn = async (pageUrl,launchOption,customFunction=[],outFilePath='./out.json') => {
    let behavior = []
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch(launchOption);
        const page = await browser.newPage();
        // Navigate the page to a URL.
        await page.goto(pageUrl);
        // Set screen size.
        // await page.setViewport({ width: 1920, height: 1080 });
        //接收自定义方法
        let allFnArray = []
        customFunction.forEach(async (fn) => {
            allFnArray.push(fn(page)) 
        })

        behavior = page.evaluate(async () => {
            return new Promise((resolve, reject) => {
                let behavior = []
                window.addEventListener('mousedown', function (e) {
                    behavior.push({
                        type: 'mousedown',
                        x: e.x,
                        y: e.y
                    })
                })
                document.addEventListener('keyup', function (e) {
                    //此处填写你的业务逻辑即可
                    if (e.code == 'Escape') {
                        resolve(behavior)
                    }
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
        
        //等待方法的结束
        await Promise.all([...allFnArray,behavior])
        fs.writeFileSync(outFilePath, JSON.stringify(await behavior));
        await browser.close();
    } catch (error) {
        console.log('error', error);
    }
}