const clientID = "0c1ev74xgec1iuf5t8whxlk794xltm";
const clientSecret = "tvlnhx3v1w6kenjb6xummy8l6vbr9u";

function obtenerTopJuegos() {

    let ajustesClave = {
        "async": true,
        "crossDomain": true,
        "url": `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
        "method": "POST",
        "headers": {}
    };

    $.ajax(ajustesClave).done(function (clave) {
        let { access_token, expires_in, token_type } = clave;
        token_type = token_type.substring(0, 1).toUpperCase() + token_type.substring(1, token_type.length);

        let authorization = `${token_type} ${access_token}`;

        let ajustesAutorizacion = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.twitch.tv/helix/games/top?first=25",
            "method": "GET",
            "headers": {
                authorization,
                "Client-Id": clientID,
            }
        };
    });
}

window.onload = obtenerTopJuegos();