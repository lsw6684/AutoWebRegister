document.getElementById('crawlForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const targetUrl = document.getElementById('targetUrl').value;
    const daumId = document.getElementById('daumId').value;
    const daumPw = document.getElementById('daumPw').value;
    const naverId = document.getElementById('naverId').value;
    const naverPw = document.getElementById('naverPw').value;
    const googleId = document.getElementById('googleId').value;
    const googlePw = document.getElementById('googlePw').value;

    // Updating config.js
    const config = require('./config');
    config.targetUrl = targetUrl;
    config.daum.id = daumId;
    config.daum.pw = daumPw;
    config.naver.id = naverId;
    config.naver.pw = naverPw;
    config.google.id = googleId;
    config.google.pw = googlePw;

    const fs = require('fs');
    fs.writeFileSync('./config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);

    // Executing index.js
    const { exec } = require('child_process');
    exec('node index.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
});