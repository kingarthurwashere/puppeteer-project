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

        const url = "https://www.noon.com/uae-en/thinkpad-p15s-gen-2-mobile-workstation-business-laptop-with-15-6-inch-display-core-i5-1145g7-processor-16gb-ram-512gb-ssd-nvidia-quadro-t500-graphics-windows-11-pro-broag-english-black/N70041845V/p/?o=b8d7fb490960ee3b";
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
            highlights: "Null",
            estimator: "Null",
            shipping_price: "Null",
            model: []
        };

        try
        {
            product.title = await page.evaluate( () =>
            {
                const titleElement = document.querySelector(
                    '.sc-320c5568-18'
                );
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
                const brandElement = document.querySelector( 'div.sc-320c5568-17.jvojBZ' );
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
                const imageElement = document.querySelector( 'div.sc-d8caf424-2.fJBKzl img' );
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
                const priceElement = document.querySelector( 'div.priceNow[data-qa="div-price-now"]' );
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
                const currencyElement = document.querySelector( 'div.priceNow[data-qa="div-price-now"]' );
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
                const specificationsElements = document.querySelectorAll( 'div.sc-966c8510-0.jLcJyt' );
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
            product.highlights = await page.evaluate( () =>
            {
                const highlightsElements = document.querySelectorAll( 'div.sc-97eb4126-1.iMnGaT' );
                return Array.from( highlightsElements, element =>
                    element.textContent.trim()
                ).join( "\n" );
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting highlights:", error );
        }

        try
        {
            product.estimator = await page.evaluate( () =>
            {
                const estimatorElement = document.querySelector( 'div.estimator_first' );
                return estimatorElement ? estimatorElement.textContent.trim() : "Not found";
            } );
        } catch ( error )
        {
            console.error( "Error occurred while extracting Shipping Price:", error );
        }

        try
        {
            product.model = await page.evaluate( () =>
            {
                const modelElement = document.querySelector( 'div.modelNumber' );
                return modelElement ? modelElement.textContent.trim() : 'Not found';
            } );


        } catch ( error )
        {
            console.error( "Error occurred while extracting model number:", error );
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
