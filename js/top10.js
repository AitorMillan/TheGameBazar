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

        $.ajax(ajustesAutorizacion).done(function (juegos) {
            var tarjetas = document.getElementById("tarjetasZona");

            for(var i = 0; i < juegos["data"].length; i++){
                var tarjeta = document.createElement("div");
                tarjeta.setAttribute("class","col-12 col-lg-6 col-xl-4 mb-4");

                var cuerpo = document.createElement("div");
                cuerpo.setAttribute("class","card text-center position-relative");

                var colorCabezera = document.createElement("div");
                colorCabezera.setAttribute("class","card-header");
                colorCabezera.setAttribute("style","height: 160px;position: absolute;width: 100%;background-color:#1C2833");

                var divImagen = document.createElement("div");
                divImagen.setAttribute("class","divImagen");
                divImagen.setAttribute("style","z-index: 1;text-align: center;");

                var img = document.createElement("img");
                var imagen = juegos["data"][i].box_art_url;
                imagen = imagen.replace("{width}","150");
                imagen = imagen.replace("{height}","180");
                img.setAttribute("src",imagen);
                img.setAttribute("alt","Imagen del juego de los top10");

                var contenido = document.createElement("div");
                contenido.setAttribute("class","card-body");
                contenido.setAttribute("style","height:100px");

                var titulo = document.createElement("h4");
                titulo.setAttribute("class","card-title");
                titulo.appendChild(document.createTextNode(juegos["data"][i].name));

                tarjetas.appendChild(tarjeta);
                tarjeta.appendChild(cuerpo);
                cuerpo.appendChild(colorCabezera);
                cuerpo.appendChild(divImagen);
                divImagen.appendChild(img);
                cuerpo.appendChild(contenido);
                contenido.appendChild(titulo);
            }
        });
    });
}

window.onload = obtenerTopJuegos();