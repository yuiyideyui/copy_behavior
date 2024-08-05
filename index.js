const { behaviorFn } = require('./inBehavior');
const { do_behavior } = require('./behavior');

// behaviorFn('http://127.0.0.1:5503/html/test1.html', {headless: false,defaultViewport: { width: 1920, height: 1080 }}, _,'./behavior.json')
do_behavior('http://127.0.0.1:5503/html/test1.html', {headless: false,defaultViewport: { width: 1920, height: 1080 }}, _,'./behavior.json')
