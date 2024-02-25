const puppeteer = require( 'puppeteer' );
( async () =>
{
    const browser = await puppeteer.launch( {
        headless: false,
        args: [ '--proxy-server=pr.oxylabs.io:7777' ]
    } );
    const page = await browser.newPage();
    await page.authenticate( {
        username: 'kairezi',
        password: '#Storeflex263'
    } );
    await page.goto( 'https://ip.oxylabs.io' );
    await page.screenshot( { path: 'example.png' } );
    await browser.close();
} )();