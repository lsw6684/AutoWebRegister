const puppeteer = require('puppeteer');
const config = require('./config');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--incognito'],
        headless:false, 
        defaultViewport: { width: 1200, height: 800 }
        }); 
    const page = await browser.newPage();
    await page.goto('https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fallhoneytip.com');

    // await daum(page);
  // await naver(page);
   // await google();


    
    // 



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
    await page.type('#id', config.naver.id);
    await page.type('#pw', config.naver.pw);
    await page.click('#log\\.login');
    
   //await page.type('#input-212', config.targetUrl);
   // const buttonSpanSelector = 'button.v-btn--depressed span.v-btn__content'; // 버튼 내부의 span 선택자
   // const buttonSpan = await page.$(buttonSpanSelector);
  //  await buttonSpan.click()    

}




async function google() {
    // 웹으로 이동: Google Search Console
    await page.goto('https://search.google.com/search-console/about?hl=ko');
    await page.click('#log.login');

}