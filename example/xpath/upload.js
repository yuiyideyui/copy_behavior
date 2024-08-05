const { behaviorFn } = require('./inBehavior');
const { do_behavior } = require('./behavior');
/**
 * 一个上传等待的方法
 */
const customFn = [(page) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('等待上传');

            //文件上传监听
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
            ]);
            await fileChooser.accept(['../../交通道路.mp4']);
            console.log('上传中');
            //监听上传进度
            // setInterval(async() => {
            //     const text = await page.$eval('.uploadVideo',element => element.textContent)
            //     console.log('text',text);
            // }, 1000);
            
            //这里需要插入一个判断上传是否结束的校验
            setTimeout(() => {
                console.log('完成上传');
                resolve();
            }, 10000);
        } catch (error) {
            reject(error);
        }
    })
}]
// behaviorFn('http://127.0.0.1:5503/html/test1.html', {headless: false,defaultViewport: { width: 1920, height: 1080 }}, customFn,'./upload.json')
do_behavior('http://127.0.0.1:5503/html/test1.html', {headless: false,defaultViewport: { width: 1920, height: 1080 }}, customFn,'./upload.json')
