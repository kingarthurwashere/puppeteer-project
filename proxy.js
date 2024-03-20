const puppeteer = require( 'puppeteer' );
( async () =>
{
    const browser = await puppeteer.launch( {
        headless: false,
        args: [ 'pr.oxylabs.io:7777' ]
    } );
    const page = await browser.newPage();
    await page.authenticate( {
        username: 'Dxbrunners',
        password: 'Mikhman_2024'
    } );
    await page.goto( 'https://ip.oxylabs.io' );
    await page.screenshot( { path: 'example.png' } );
    await browser.close();
} )();