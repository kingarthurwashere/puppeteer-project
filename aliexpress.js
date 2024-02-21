const puppeteer = require( "puppeteer" );

// Function to generate a unique job ID
function generateJobId ()
{
    const timestamp = new Date().getTime();
    const random = Math.floor( Math.random() * 1000 );
    return `job_${ timestamp }_${ random }`;
}

( async () =>
{
    let browser;
    try
    {
        browser = await puppeteer.launch( {
            headless: false,
            defaultViewport: null,
            userDataDir: "./tmp",
            browserContext: "default",
        } );

        const page = await browser.newPage();

        await page.setCacheEnabled( false );

        // Set the location to the United Arab Emirates (UAE)
        await page.setGeolocation( { latitude: 24.4539, longitude: 54.3773 } );

        const client = await page.target().createCDPSession();

        await client.send( 'Emulation.setGeolocationOverride', {
            accuracy: 100,
            latitude: 24.42312,
            longitude: 105.75868,
        } );

        // Increase navigation timeout to 60 seconds
        await page.setDefaultNavigationTimeout( 60000 );

        const url = "https://www.aliexpress.com/item/1005005257478247.html?spm=a2g0o.best.moretolove.10.33412c25We26f8";
        await page.goto( url );

        let product = {
            jobId: generateJobId(),
            url: url,
            title: "Null",
            image: "Null",
            price: "Null",
            currency: "Null",
            description: "Null",
            shipping_price: "Null",
            description_images: []
        };

        try
        {
            product.title = await page.evaluate( () =>
            {
                const titleElement = document.querySelector(
                    'h1[data-pl="product-title"]'
                );
                return titleElement ?
                    titleElement.textContent.trim() :
                    "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting title:", error );
        }

        try
        {
            product.image = await page.evaluate( () =>
            {
                const imageElement = document.querySelector(
                    'div.image-view--previewBox--FyWaIlU img.magnifier--image--L4hZ4dC'
                );
                return imageElement ? imageElement.getAttribute( "src" ) : "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting image:", error );
        }

        try
        {
            product.price = await page.evaluate( () =>
            {
                const priceElement = document.querySelector( 'div.price--current--H7sGzqb.product-price-current' );
                return priceElement ? priceElement.textContent.trim() : 'Not found';
            } );
            product.price = parseFloat( product.price.replace( /[^\d.]/g, '' ) );
        } catch ( error )
        {
            console.error( "Error occurred while extracting price:", error );
        }

        try
        {
            product.currency = await page.evaluate( () =>
            {
                const currencyElement = document.evaluate(
                    '//span[@class="es--char--Vcv75ku"]',
                    document,
                    null,
                    XPathResult.ANY_TYPE,
                    null
                );
                const currencyNode = currencyElement.iterateNext();
                return currencyNode ? currencyNode.textContent : "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting currency symbol:", error );
        }

        try
        {
            product.description = await page.evaluate( () =>
            {
                const descriptionElements = document.querySelectorAll(
                    'div#product-description div.description--origin-part--SsZJoGC div.detailmodule_html div.detail-desc-decorate-richtext div'
                );
                return Array.from( descriptionElements, element =>
                    element.textContent.trim()
                ).join( "\n" );
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting description:", error );
        }

        try
        {
            product.shipping_price = await page.evaluate( () =>
            {
                const shippingPriceElement = document.querySelector( 'div[data-pl="product-shipping"] div.dynamic-shipping div.dynamic-shipping-line.dynamic-shipping-titleLayout span strong' );
                return shippingPriceElement ? shippingPriceElement.textContent.trim() : "Not found";
            } );
            product.shipping_price = parseFloat( product.shipping_price.replace( /[^\d.]/g, '' ) );

        } catch ( error )
        {
            console.error( "Error occurred while extracting Shipping Price:", error );
        }

        try
        {
            product.description_images = await page.evaluate( () =>
            {
                const imageElements = document.evaluate(
                    '//div[@id="product-description"]//img/@src',
                    document,
                    null,
                    XPathResult.ANY_TYPE,
                    null
                );
                const result = [];
                let node = imageElements.iterateNext();
                while ( node )
                {
                    result.push( node.value );
                    node = imageElements.iterateNext();
                }
                return result;
            } );
        } catch ( error )
        {
            console.error(
                "Error occurred while extracting description images:",
                error
            );
        }

        console.log( JSON.stringify( product, null, 2 ) );
    } catch ( error )
    {
        console.error( "An error occurred:", error );
    } finally
    {
        if ( browser )
        {
            await browser.close();
        }
    }
} )();
