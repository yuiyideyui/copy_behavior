// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';

/**
 * 按下Escape退出页面行为监听记录
 * @param {String} pageUrl 页面url
 * @param {Object} launchOption launch配置
 * @param {String} outFilePath 输出文件路径
 */
exports.behaviorFn = async (pageUrl,launchOption,outFilePath='./out.json') => {
    let behavior = []
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch(launchOption);
        const page = await browser.newPage();
        // Navigate the page to a URL.
        await page.goto(pageUrl);
        behavior = page.evaluate(async () => {
            return new Promise((resolve, reject) => {
                let behavior = []
                //生成Xpath路径
                function getXPath(node) {
                    if (node === document.body)
                        return '/html/'+node.tagName;
                    let nodeCount = 0;
                    let siblings = node.parentNode.childNodes;
                    for (let i = 0; i < siblings.length; i++) {
                        let sibling = siblings[i];
                        if (sibling === node)
                            return `${getXPath(node.parentNode)}/${node.tagName}[${nodeCount + 1}]`;
                        if (sibling.nodeType === 1 && sibling.tagName === node.tagName)
                            nodeCount++;
                    }
                }

                window.addEventListener('mousedown', function (e) {
                    if (e.target.tagName.toLowerCase() === 'input' && e.target.type === 'file') {
                        behavior.push({
                            type: 'inputFile',
                            xpath:getXPath(e.target)
                        })
                    } else if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'text'){
                        behavior.push({
                            type: 'inputText',
                            xpath:getXPath(e.target)
                        })
                    } else if(e.target.tagName.toLowerCase() === 'textarea'){
                        behavior.push({
                            type: 'textarea',
                            xpath:getXPath(e.target)
                        })
                    } else {
                        behavior.push({
                            type: 'xPath',
                            xpath:getXPath(e.target)
                        })
                    }
                    
                })
                document.addEventListener('keyup', function (e) {
                    //退出
                    if (e.code == 'Escape') {
                        resolve(behavior)
                    }
                })
                window.addEventListener('wheel', function (event) {
                    // 阻止默认滚动行为
                    event.preventDefault();
                    //复制滚轮行为
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
        await Promise.all([behavior])
        fs.writeFileSync(outFilePath, JSON.stringify(await behavior));
        await browser.close();
    } catch (error) {
        console.log('error', error);
    }
}