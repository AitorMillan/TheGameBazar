var idContador = ""
var divBarra = ""
var width = 10;
var barra = ""

function contador() {
    width++; 
    barra.setAttribute("style", "width: "+width+"%")
}


function empezarTesting(){
    var contMal = 0;
    var contBien = 0;

    var contenido = document.getElementById("contenidoTesting");
    
    divBarra.setAttribute("class","progress")
    idContador = setInterval(contador, 2);

    var div = document.createElement("div");
    contenido.appendChild(div);

    var frase = document.createElement("div");

    frase = "<h5 class='text-center'>Top 10</h5>"+
    "<p class='m-0'>URL: /obtenerTop10</p>"+
    "<p class='m-0'>Datos: sin datos</p>"+
    "<p class='m-0'>Tipo: HTTP y consulta API Twitch</p>"+
    "<p class='m-0'>Resultado esperado: 200</p>";

    $.ajax({
        method: "GET",
        url: "/obtenerTop10",
        dataType: "json"
    }).done(function() {
        contBien++;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

        frase += "<h5 class='text-center mt-2'>Top 10 con un juego</h5>"+
        "<p class='m-0'>URL: /obtenerTop10/Resident Evil 4</p>"+
        "<p class='m-0'>Datos: Nombre del juego</p>"+
        "<p class='m-0'>Tipo: HTTP y consulta API Twitch</p>"+
        "<p class='m-0'>Resultado esperado: 404</p>";

        $.ajax({
            method: "GET",
            url: "/obtenerTop10/Resident Evil 4",
            dataType: "json",
        }).done(function() {
            contMal++;
            frase += "<p>Resultado obtenido: 200</p>";
            frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

        }).fail(function() {
            contBien++;
            frase = frase + "<p>Resultado obtenido: 404</p>";
            frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

            frase += "<h5 class='text-center mt-2'>Iniciar Sesion existente</h5>"+
            "<p class='m-0'>URL: /iniciarSesion/Alex;******</p>"+
            "<p class='m-0'>Datos: Nombre de Usuario y contraseña</p>"+
            "<p class='m-0'>Tipo: HTTP y consulta BBDD</p>"+
            "<p class='m-0'>Resultado esperado: 200</p>";

            $.ajax({
                method: "PUT",
                url: "/iniciarSesion/Alex;TGB123",
                dataType: "json",
            }).done(function() {
                contBien++;
                frase += "<p>Resultado obtenido: 200</p>";
                frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

                frase += "<h5 class='text-center mt-2'>Registrar administrador</h5>"+
                "<p class='m-0'>URL: /registrarUsuario/Alex;******</p>"+
                "<p class='m-0'>Datos: Nombre de Usuario y contraseña</p>"+
                "<p class='m-0'>Tipo: HTTP y inserción BBDD</p>"+
                "<p class='m-0'>Resultado esperado: 200</p>";

                $.ajax({
                    method: "PUT",
                    url: "/registrarUsuario/Alex;TGB123",
                    dataType: "json",
                }).done(function() {
                    contBien++;
                    frase += "<p>Resultado obtenido: 200</p>";
                    frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

                }).fail(function() {
                    contMal++;
                    frase = frase + "<p>Resultado obtenido: 500</p>";
                    frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

                    frase += "<h5 class='text-center mt-2'>Obtener juego</h5>"+
                    "<p class='m-0'>URL: /obtenerJuegos/Resident Evil 4</p>"+
                    "<p class='m-0'>Datos: Nombre del juego</p>"+
                    "<p class='m-0'>Tipo: HTTP y consulta api Cheapshark</p>"+
                    "<p class='m-0'>Resultado esperado: 200</p>";

                    $.ajax({
                        method: "PUT",
                        url: "/obtenerJuegos/Resident Evil 4",
                        dataType: "json",
                    }).done(function() {
                        contBien++;
                        frase += "<p>Resultado obtenido: 200</p>";
                        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

                        frase += "<h5 class='text-center mt-2'>Obtener juego con simbolos</h5>"+
                        "<p class='m-0'>URL: /obtenerJuegos/Resident% Evil% 4</p>"+
                        "<p class='m-0'>Datos: Nombre del juego</p>"+
                        "<p class='m-0'>Tipo: HTTP y consulta api Cheapshark</p>"+
                        "<p class='m-0'>Resultado esperado: 200</p>";

                        $.ajax({
                            method: "PUT",
                            url: "/obtenerJuegos/Resident%1 Evil%2 4",
                            dataType: "json",
                        }).done(function() {
                            contBien++;
                            frase += "<p>Resultado obtenido: 200</p>";
                            frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"
                            div.innerHTML = frase;

                        }).fail(function() {
                            contMal++;
                            frase = frase + "<p>Resultado obtenido: 500</p>";
                            frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"
                            
                            clearInterval(idContador);
                            divBarra.setAttribute("class","progress invisible")
                            
                            contenido.innerHTML = "";

                            contenido.appendChild(div);
                            div.innerHTML = frase;

                            var divFinal = document.createElement("div");
                            divFinal.setAttribute("class","text-center");

                            contenido.appendChild(divFinal);

                            divFinal.innerHTML ="<i class='bi bi-shield-fill-check text-success'> Aprobado = "+contBien+"</i>"+
                            "<i class='bi bi-shield-fill-exclamation text-danger ml-3'> No aprobado = "+contMal+"</i>"
                        }); 

                    }).fail(function() {
                        contMal++;
                        frase = frase + "<p>Resultado obtenido: 500</p>";
                        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"
                        div.innerHTML = frase;
                    }); 
                }); 

            }).fail(function() {
                contMal++;
                frase = frase + "<p>Resultado obtenido: 500</p>";
                frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"
                div.innerHTML = frase;
            }); 

        }); 

    }).fail(function() {
        contMal++;
        frase = frase + "<p>Resultado obtenido: 500</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No Aprobado</i>"
        div.innerHTML = frase;
    }); 

}

function main(){
    divBarra = document.getElementById("divBarraDeProceso");
    barra = document.getElementById("barraDeProceso");
}

window.onload = main();