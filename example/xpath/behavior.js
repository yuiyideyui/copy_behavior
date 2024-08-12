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
 * @param {Object} objFn inputFile:Array[] -文件上传 
 * @param {String} inFilePath 输入文件路径
 */
exports.do_behavior = async (pageUrl, launchOption, customFunction = [],objFn = {}, inFilePath = './out.json') => {
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

    //objFn的index
    let inputFileIndex = 0
    let inputFilePromise = []
    let inputTextIndex = 0
    let textAreaIndex = 0

    // await page.setDefaultNavigationTimeout(60000);
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await sleep(3000)
    const behavior = JSON.parse(fs.readFileSync(inFilePath));
    for (let i = 0; i < behavior.length; i++) {
        let nowBe = behavior[i];
        if (nowBe.type == 'xPath') {
            // Runs the `//h2` as the XPath expression.
            const element = await page.waitForSelector(`::-p-xpath(${nowBe.xpath})`);
            element.click();
            await sleep(1000)
        }
        else if (nowBe.type == 'wheel') {
            await page.mouse.wheel({ deltaY: nowBe.deltaY })
            await sleep(1000)
        }else if(nowBe.type == 'inputFile'){
            const element = await page.waitForSelector(`::-p-xpath(${nowBe.xpath})`);
            inputFilePromise.push(objFn.inputFile[inputFileIndex](page,element))
            // element.click();
            inputFileIndex++
            
        }else if(nowBe.type == 'inputText'){
            const element = await page.waitForSelector(`::-p-xpath(${nowBe.xpath})`);
            element.focus();
            await element.evaluate((el,{value}) => {
                el.value = value
            },{value:objFn.inputText[inputTextIndex]});
            inputTextIndex++
            await sleep(1000)
        }else if(nowBe.type == 'textArea'){
            const element = await page.waitForSelector(`::-p-xpath(${nowBe.xpath})`);
            element.focus();
            await element.evaluate((el,{value}) => {
                el.value = value
            },{value:objFn.textArea[textAreaIndex]});
            textAreaIndex++
            await sleep(1000)
        }
    }
    //等待方法的结束
    await Promise.all([...allFnArray,inputFilePromise])
    await sleep(1000)
    await browser.close();
}