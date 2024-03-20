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
            headless: true,
            defaultViewport: null,
            userDataDir: "./tmp",
            browserContext: "default",
        } );
        const page = await browser.newPage();

        await page.setCacheEnabled( false );
        console.log( "Browser cache disabled." );

        const url = "https://www.aliexpress.com/item/1005005220784707.html";
        await page.goto( url );

        // Scroll down the page
        await page.evaluate( () =>
        {
            window.scrollBy( 0, window.innerHeight ); // Scrolls down by the height of the viewport
        } );

        let product = {
            jobId: generateJobId(),
            url: url,
            title: "Null",
            image: "Null",
            price: "Null",
            currency: "Null",
            description: "Null",
            shipping_price: "Null",
            specifications: "Null",
            highlights: "Null",
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
            product.shipping_price = await page.evaluate( () =>
            {
                const shippingPriceElement = document.querySelector( 'div[data-pl="product-shipping"] div.dynamic-shipping div.dynamic-shipping-line.dynamic-shipping-titleLayout span strong' );
                return shippingPriceElement ? shippingPriceElement.textContent.trim() : "Not found";
            } );

            if ( product.shipping_price !== "Not found" )
            {
                product.shipping_price = parseFloat( product.shipping_price.replace( /[^\d.]/g, '' ) );
            } else
            {
                // Handle case where shipping price is not found
                // For example, you can assign a default value
                product.shipping_price = 0.0;
            }
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
            console.error( "Error occurred while extracting description images:", error );
        }

        try
        {
            product.description = await page.evaluate( () =>
            {
                const descriptionElement = document.querySelector( '.specification--list--fiWsSyv' );
                return descriptionElement ? descriptionElement.textContent.trim() : 'Not found';
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting description:", error );
        }

        try
        {
            product.specifications = await page.evaluate( () =>
            {
                const specificationsElement = document.querySelector( '.description--origin-part--SsZJoGC' );
                return specificationsElement ? specificationsElement.textContent.trim() : 'Not found';
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting specifications:", error );
        }

        try
        {
            product.highlights = await page.evaluate( () =>
            {
                const highlightsElement = document.querySelector( 'div.product-detail-tab-content' );
                return highlightsElement ? highlightsElement.textContent.trim() : 'Not found';
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting highlights:", error );
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
