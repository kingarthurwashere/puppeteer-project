const fetch = require( 'node-fetch' );

const username = 'kairezi';
const password = '#Storeflex263!';
const body = {
    'source': 'universal_ecommerce',
    'url': 'https://aliexpress.com/item/1005005461598568.html',
    'geo_location': 'United States',
    'render': 'html',
    'parse': true
};

fetch( 'https://realtime.oxylabs.io/v1/queries', {
    method: 'post',
    body: JSON.stringify( body ),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from( `${ username }:${ password }` ).toString( 'base64' ),
    }
} )
    .then( response =>
    {
        if ( !response.ok )
        {
            throw new Error( `HTTP error! Status: ${ response.status }` );
        }
        return response.json();
    } )
    .then( data => console.log( data ) )
    .catch( error => console.error( 'Error:', error.message ) );
