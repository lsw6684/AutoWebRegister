const express = require('express');
const puppeteer = require('puppeteer-extra');
//const config = require('./config');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

var config = {
  targetUrl: '',
  daum: {
    id: '',
    pw: ''
  },
  naver: {
    id: '',
    pw: '',
  },
  google: {
    id: '',
    pw: '',
  }
};



const app = express();
const PORT = process.env.PORT || 8081;

// 정적 파일을 제공할 경로를 지정
app.use(express.static(__dirname));

// express.urlencoded: 미들웨어로 HTMP 폼 데이터 해석해서 JS객체로 변환
app.use(express.urlencoded({ extended: true }));
// express.json: 미들웨어로 JSON 데이터 해석해서 JS 객체로 변환
app.use(express.json());



app.get('/', (req, res) => {
  console.log('GET');
  res.sendFile(__dirname + '/index.html');    // Front-End 폼 보여줄 루트 경로
})

app.get('/test', (req, res) => {
  console.log('GET /test');
  res.sendFile(__dirname + '/index.html');    // Front-End 폼 보여줄 루트 경로
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); //서버 시작 로그
})



async function daum(page) {
  console.log('Daum Start');

  // 웹으로 이동: Daum Web Master Tool
  await page.goto('https://webmaster.daum.net/login#none');
  console.log('Daum Webmaster')



  // Login
  await page.waitForTimeout(1000);
  await page.waitForSelector('#authSiteUrl'); // 요소가 나타날 때까지 대기
  await page.type('#authSiteUrl', config.daum.id);
  await page.type('#authPinCode', config.daum.pw);
  console.log('Daum input')
  await page.click('.btn_register');
  console.log('Daum Login')

  await page.goto('https://webmaster.daum.net/tool/collect');

  // 등록 URL
  await page.waitForSelector('#collectReqUrl'); // 요소가 나타날 때까지 대기
  await page.type('#collectReqUrl', config.targetUrl);
  await page.click('.btn_result');
  //await page.screenshot({ path: 'daum.png' });
}

async function naver(page) {
  console.log('Naver Start');

  var blogUrl = new URL(config.daum.id);
  var domain = blogUrl.hostname;

  // 웹으로 이동: Naver search console
  await page.goto(`https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2F${domain}`);
  console.log('Naver goto')


  // Login
  await page.evaluate((id, pw) => {
    document.querySelector("#id").value = id;
    document.querySelector("#pw").value = pw;
  }, config.naver.id, config.naver.pw)

  await page.click('#log\\.login');
  await page.waitForSelector('#input-212'); // 요소가 나타날 때까지 대기

  await page.type('#input-212', config.targetUrl);

  // 제출
  await page.click('button.v-btn--depressed span.v-btn__content');


  await page.waitForTimeout(6000);

  // page.on('dialog', async (dialog) => {
  //   console.log( dialog.type() );

  //   console.log( dialog.message() );
  //   await dialog.accept();
  // });

  await page.keyboard.press('Enter');

  // 스크린샷 찍기
  //await page.screenshot({ path: 'naver.png' });


}


async function google(page) {
  console.log('Google Start');
  // 보안 정책 우회
  const loginUrl = "https://accounts.google.com/AccountChooser?service=mail&continue=https://google.com&hl=en";
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';

  await page.setUserAgent(ua);
  await page.goto('https://search.google.com/search-console/about?hl=ko', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const startButton = document.querySelector('a span.RveJvd');
    if (startButton) {
      startButton.click();
    }
  });
  await page.waitForSelector('#identifierId')
  await page.type('#identifierId', config.google.id);
  // 버튼이 나타날 때까지 기다림
  await page.waitForSelector('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');

  console.log('Google ID');

  //await page.keyboard.press('Enter');
  // 버튼 클릭
  await page.click('button[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b"]');

  // 비밀번호 변경 text쪽
  var selector = '.rhhJr[jsname="f2d3ae"][role="presentation"][tabindex="null"]';

  // 요소가 나타날 때까지 대기
  await page.waitForSelector(selector);
  await page.type('input[type="password"]', config.google.pw);
  await page.keyboard.press('Enter');

  console.log('Google PW');

  // 나중에 버튼 가끔 드는 거
  // 선택자 사용해서 요소 찾기
  const element = await page.$('span[jsname="V67aGc"]');

  // 요소가 존재하고, HTMLElement이며, 화면에 보이면 클릭합니다.
  if (element) {
    const isClickable = await page.evaluate(el => {
      return el instanceof HTMLElement && el.offsetHeight > 0 && el.offsetWidth > 0;
    }, element);

    if (isClickable) {
      await element.click();
    }
  }

  const text = '개요';
  const parentSelector = 'span.SaG06d';

  // 텍스트가 나타날 때까지 대기
  await page.waitForFunction((text, parentSelector) => {
    const spanElement = document.querySelector(parentSelector);
    return spanElement && spanElement.textContent.includes(text);
  }, {}, text, parentSelector);


  selector = 'i.google-material-icons.rZ7UQ';
  // 요소가 나타날 때까지 대기
  await page.waitForSelector(selector);
  await page.waitForTimeout(1000);


  selector = 'input.Ax4B8.ZAGvjd[jsname="dSO9oc"]';
  // 입력 요소에 텍스트 입력
  await page.type(selector, config.targetUrl);
  await page.keyboard.press('Enter');

  await page.waitForSelector('div.MreLB.QrfJGb');
  await page.waitForTimeout(1000);

  selector = await page.waitForSelector('span.ZaflVd.o4cf5c');
  await selector.click();

  console.log('Google waiting');

  try {
    // 해당 selector가 등장할 때까지 최대 2분(120000ms) 동안 대기
    await page.waitForSelector('.google-material-icons.gSgQrb', { timeout: 120000 });

    //await page.screenshot({ path: 'google.png' });
  } catch (error) {
    console.error("Timeout Error:", error);
  }
}


async function bing(page) {
  console.log('Bing Start');

  // 웹으로 이동: Bing Web Master Tool
  await page.goto(`https://www.bing.com/webmasters/urlinspection?siteUrl=${config.daum.id}`);
  console.log('Bing Webmaster')

  // 시작하기 버튼
  await page.waitForSelector('.getStartedButton');
  await page.click('.getStartedButton');

  // Google Login
  await page.waitForSelector('.signInCard');

  // Click
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('.signInCard'));
    if (elements.length > 1) { // 요소가 2개 이상 있는지 확인
      elements[1].click(); // 두 번째 요소 클릭
    }
  });

  await page.waitForSelector('#TextField31');
  await page.type('#TextField31', config.targetUrl);


  // inspect 클릭
  await page.click('span#id__36');          
  
  // request 클릭
  const changableSelector = 'button[data-tag="requestIndexingButton"]';
  const changableButton = await page.waitForSelector(changableSelector);
  await changableButton.click();




   // 5초 동안 대기합니다.
   await page.waitForTimeout(3000);
 
   // 버튼을 클릭합니다.
   await page.evaluate(() => {
    Array.from(document.querySelectorAll('span.ms-Button-label')).find(el => el.textContent.trim() === 'Request indexing').click();
  });


  await page.waitForTimeout(3000);
  // 제출 버튼
  await page.waitForSelector('button[data-tag="submitBtn"]');
  await page.click('button[data-tag="submitBtn"]');
}

// post 핸들러
app.post('/submit', async (req, res) => {
  console.log('submit');

  const inputData = req.body;

  // 절달 받은 데이터
  config.targetUrl = String(inputData.targetUrl);
  config.daum.id = String(inputData.daumId);
  config.daum.pw = String(inputData.daumPw);
  config.naver.id = String(inputData.naverId);
  config.naver.pw = String(inputData.naverPw);
  config.google.id = String(inputData.googleId);
  config.google.pw = String(inputData.googlePw);
  console.log(config);

  // Puppeteer 브라우저 인스턴스 생성
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true, // HTTP 오류 무시
    headless: false, // 브라우저 창을 띄움 (headless: true로 설정하면 보이지 않는 상태로 실행)
    defaultViewport: { width: 1024, height: 800 } // 브라우저 창 크기 설정
  });

  // 새로운 브라우저 컨텍스트 생성 (시크릿 브라우징)
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage(); // 새 페이지 생성

  await page.waitForTimeout(1000);

  // await daum(page);   // 다음 제출
  // await naver(page);  // 네이버 제출
  await google(page); // 구글 제출
  await bing(page);   // Bing 제출
  


});