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

        // Increase navigation timeout to 60 seconds
        await page.setDefaultNavigationTimeout( 60000 );

        const url = "https://www.aliexpress.com/item/1005006364469534.html?spm=a2g0o.home.pcJustForYou.28.650c76dbHKX95z&gps-id=pcJustForYou&scm=1007.13562.333647.0&scm_id=1007.13562.333647.0&scm-url=1007.13562.333647.0&pvid=8ecee96c-0cfd-443a-9e2f-2bb95d1041eb&_t=gps-id:pcJustForYou,scm-url:1007.13562.333647.0,pvid:8ecee96c-0cfd-443a-9e2f-2bb95d1041eb,tpp_buckets:668%232846%238110%231995&pdp_npi=4%40dis%21AED%2164.28%217.81%21%21%21125.35%2115.22%21%402103146c17087992227476886e77c8%2112000036906483026%21rec%21AE%21%21AB&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A";
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
                const descriptionElements = document.querySelectorAll( 'div.description--origin.-part--SsZJoGC span' );
                return Array.from( descriptionElements, element => element.textContent.trim() ).join( "\n" );
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
