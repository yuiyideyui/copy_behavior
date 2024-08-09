const { behaviorFn } = require('./inBehavior');
const { do_behavior } = require('./behavior');
/**
 * 一个上传等待的方法
 */
const customFn = []
const objFn = {
    inputFile:[
        (page,element) => {
            let times = null
            return new Promise(async (resolve, reject) => {
                try {
                    console.log('等待上传');
                    element.click()
                    //文件上传监听
                    const [fileChooser] = await Promise.all([
                        page.waitForFileChooser(),
                    ]);
                    
                    await fileChooser.accept(['../../交通道路.mp4']);
                    console.log('上传中');
                    //监听上传进度
                    times = setInterval(async() => {
                        const text = await page.$eval('.progress',element => element.textContent)
                        if(text.includes('100')){
                            console.log('上传完成');
                            clearInterval(times)
                            resolve();
                        }
                    }, 1000);
                } catch (error) {
                    reject(error);
                }
            })
        }
    ],
    inputText:[
        'hello',
        '你好啊-'
    ]
}

// behaviorFn('http://127.0.0.1:5504/html/test1.html', {headless: false,defaultViewport: { width: 1920, height: 1080 }},'./upload.json')
do_behavior('http://127.0.0.1:5504/html/test1.html', {headless: false,defaultViewport: { width: 1920, height: 1080 }}, customFn,objFn,'./upload.json')
