// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';
const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
/**
 * 
 * @param {String} pageUrl 页面url
 * @param {Object} launchOption launch配置
 * @param {ArrayFunction} customFunction 自定义方法-如fileChooser 给function传入page参数
 * @param {String} inFilePath 输入文件路径
 */
exports.do_behavior = async (pageUrl, launchOption, customFunction = [], inFilePath = './out.json') => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch(launchOption);
    const page = await browser.newPage();
    // Navigate the page to a URL.
    await page.goto(pageUrl);
    //接收自定义方法
    let allFnArray = []
    customFunction.forEach(async (fn) => {
        allFnArray.push(fn(page))
    })
    await sleep(1000)
    const behavior = JSON.parse(fs.readFileSync(inFilePath));
    for (let i = 0; i < behavior.length; i++) {
        let nowBe = behavior[i];
        if (nowBe.type == 'xPath') {
            // await page.mouse.click(nowBe.x, nowBe.y)
            // Runs the `//h2` as the XPath expression.
            const element = await page.waitForSelector(`::-p-xpath(${nowBe.xpath})`);
            element.click();
            await sleep(1000)
        }
        else if (nowBe.type == 'wheel') {
            await page.mouse.wheel({ deltaY: nowBe.deltaY })
            await sleep(1000)
        }
    }
    //等待方法的结束
    await Promise.all([...allFnArray])
    await browser.close();
}