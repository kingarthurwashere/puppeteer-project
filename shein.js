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
        const proxy = 'ae-pr.oxylabs.io:40000';
        const username = 'Dxbrunners';
        const password = 'Mikhman_2024';

        const launchOptions = {
            args: [ `--proxy-server=${ proxy }` ],
            headless: true
        };

        browser = await puppeteer.launch( launchOptions );
        const page = await browser.newPage();

        // Set up proxy authentication
        await page.authenticate( {
            username,
            password
        } );


        await page.setCacheEnabled( false );

        // Increase navigation timeout to 60 seconds
        await page.setDefaultNavigationTimeout( 120000 );

        const url = "https://www.shein.com/Manfinity-Hypemode-Men-s-Random-Tie-Dyeing-Gradient-Letter-Print-Short-Sleeve-T-Shirt-p-28790114-cat-1980.html?src_identifier=on%3DIMAGE_COMPONENT%60cn%3Dshopbycate%60hz%3DhotZone_2%60ps%3D4_2%60jc%3Dreal_2026&src_module=All&src_tab_page_id=page_home1708802441498&mallCode=1&imgRatio=3-4";
        await page.goto( url );

        let product = {
            jobId: generateJobId(),
            url: url,
            title: "Null",
            brand: "Null",
            image: "Null",
            price: "Null",
            currency: "Null",
            specifications: "Null",
            measurements: "Null",
            estimator: "Null",
            shipping_price: "Null",
            model: []
        };

        try
        {
            product.title = await page.evaluate( () =>
            {
                const titleElement = document.querySelector( 'h1.product-title' );
                return titleElement ? titleElement.textContent.trim() : "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting title:", error );
        }

        try
        {
            product.brand = await page.evaluate( () =>
            {
                const brandElement = document.querySelector( 'div[data-qa="pdp-brand-N52103168A"]' );
                return brandElement ? brandElement.textContent.trim() : "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting brand:", error );
        }


        try
        {
            product.image = await page.evaluate( () =>
            {
                const imageElement = document.querySelector( 'div.product-intro__thumbs-inner div.product-intro__thumbs-item img' );
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
                const priceElement = document.querySelector( 'div.product-intro__head-mainprice div.original span' );
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
                const currencyElement = document.querySelector( 'div.original.from span' );
                if ( currencyElement )
                {
                    const currencyText = currencyElement.textContent.trim();
                    // Extract the currency symbol and convert it to uppercase
                    return currencyText.match( /[A-Z]+/ ) ? currencyText.match( /[A-Z]+/ )[ 0 ] : "Not found";
                } else
                {
                    return "Not found";
                }
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting currency symbol:", error );
        }


        try
        {
            product.specifications = await page.evaluate( () =>
            {
                const specificationsElements = document.querySelectorAll( 'div.product-intro__attr-wrap div.product-intro__description-table-item' );
                return Array.from( specificationsElements, element =>
                    element.textContent.trim()
                ).join( "\n" );
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting specifications:", error );
        }

        try
        {
            product.measurements = await page.evaluate( () =>
            {
                const measurementsElements = document.querySelectorAll( 'div.product-intro__size-choose.fsp-element div.product-intro__size-radio' );
                return Array.from( measurementsElements, element =>
                    element.textContent.trim()
                ).join( "\n" );
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting measurements:", error );
        }

        try
        {
            product.estimator = await page.evaluate( () =>
            {
                const estimatorElement = document.evaluate( '//p[contains(@class, "product-intro__freeshipping-time")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                return estimatorElement ? estimatorElement.textContent.trim() : "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting estimator:", error );
        }


        try
        {
            product.model = await page.evaluate( () =>
            {
                const modelElement = document.evaluate( '//div[@class="product-intro__head-sku"]//font[contains(text(), "SKU:")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                return modelElement ? modelElement.textContent.trim().replace( "SKU: ", "" ) : 'Not found';
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting model number:", error );
        }

        try
        {
            product.shipping_price = await page.evaluate( () =>
            {
                const shippingPriceElement = document.evaluate( '//div[@class="shipping-price"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                return shippingPriceElement ? shippingPriceElement.textContent.trim() : "Not found";
            } );
            product.shipping_price = parseFloat( product.shipping_price.replace( /[^\d.]/g, '' ) );
        } catch ( error )
        {
            console.error( "Error occurred while extracting Shipping Price:", error );
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
