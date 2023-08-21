const puppeteer = require('puppeteer');
const config = require('./config');

(async () => {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: { width: 1200, height: 800 }
        });
        const page = await browser.newPage();
    
//    const page = await browser.newPage();


    // await daum(page);
    await naver(page);
    //await google(page);


   
    



    // 브라우저 종료
   // await browser.close();

})();




async function daum(page) {
    // 웹으로 이동: Daum Web Master Tool
    await page.goto('https://webmaster.daum.net/login#none');
    


    // Login
    await page.type('#authSiteUrl', config.daum.url);
    await page.type('#authPinCode', config.daum.pw);
    await page.click('.btn_register');
    

    
    // 등록 URL
    await page.type('#collectReqUrl', config.targetUrl);
    await page.click('.btn_result');
    await page.screenshot({ path: 'daum.png' });
}

async function naver(page) {
    // 웹으로 이동: Naver search console
    await page.goto('https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fallhoneytip.com');


    
    // Login
    await page.evaluate((id, pw) => {
        document.querySelector("#id").value = id;
        document.querySelector("#pw").value = pw;
    }, config.naver.id, config.naver.pw)
    
    await page.click('#log\\.login');
    await page.waitForSelector('#input-212'); // 요소가 나타날 때까지 대기

    await page.type('#input-212', config.targetUrl);

    await page.waitForSelector('.v-btn__content'); // 요소가 나타날 때까지 대기
    await page.evaluate(() => {
        const startButton = document.querySelector('button span.v-btn__content');
        if (startButton) {
          startButton.click();
        }
      });    
}




async function google(page) {
    // 웹으로 이동: Google Search Console
    await page.goto('https://search.google.com/search-console/about?hl=ko');
    await page.evaluate(() => {
        const startButton = document.querySelector('a span.RveJvd');
        if (startButton) {
          startButton.click();
        }
      });
    await page.waitForSelector('#identifierId')
    await page.type('#identifierId', config.google.id);
    // await page.waitForSelector('.VfPpkd-vQzf8d'); // 요소가 나타날 때까지 대기
    // await page.click('.VfPpkd-vQzf8d');
}