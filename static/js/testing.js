var idContador = "";
var divBarra = "";
var width = 10;
var barra = "";

var div = "";
var frase = ""
var contenido = "";

var contMal = 0;
var contBien = 0;


var comprobarTop10 = false;
var comprobarTop10Buscando = false;
var comprobarInicio = false;
var comprobarRegistro = false;
var comprobarObtenerJuego = false;
var comprobarObtenerJuego2 = false;


function contador() {
    width++; 
    barra.setAttribute("style", "width: "+width+"%")
}


function top10UnJuego(){
    var fraseI = "<h5 class='text-center'>Top 10</h5>"+
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
        frase += fraseI;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>";

        comprobarTop10 = true;

    }).fail(function() {

        contMal++;
        frase += fraseI;
        frase += "<p>Resultado obtenido: 500</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No Aprobado</i>"
        
        comprobarTop10 = true;

    });

            
}


function top10Buscando(){
    var fraseI = "<h5 class='text-center mt-2'>Top 10 con un juego</h5>"+
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
        frase += fraseI;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

        comprobarTop10Buscando = true;

    }).fail(function() {

        contBien++;
        frase += fraseI;
        frase = frase + "<p>Resultado obtenido: 404</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

        comprobarTop10Buscando = true;
    })
}


function iniciarSesion(){
    var fraseI = "<h5 class='text-center mt-2'>Iniciar Sesion existente</h5>"+
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
        frase += fraseI;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

        comprobarInicio = true;

    }).fail(function() {

        contMal++;
        frase += fraseI;
        frase = frase + "<p>Resultado obtenido: 500</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

        comprobarInicio = true;

    }); 
}

function registrar(){
    var fraseI = "<h5 class='text-center mt-2'>Registrar administrador</h5>"+
    "<p class='m-0'>URL: /registrarUsuario/Alex;******</p>"+
    "<p class='m-0'>Datos: Nombre de Usuario y contraseña</p>"+
    "<p class='m-0'>Tipo: HTTP y inserción BBDD</p>"+
    "<p class='m-0'>Resultado esperado: 500</p>";

    $.ajax({
        method: "PUT",
        url: "/registrarUsuario/Alex;TGB123",
        dataType: "json",
    }).done(function() {

        contMal++;
        frase += fraseI;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

        comprobarRegistro = true;

    }).fail(function() {
       
        contBien++;
        frase += fraseI;
        frase += "<p>Resultado obtenido: 500</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

        comprobarRegistro = true;

    });
}

function obtenerJuego(){

    var fraseI = "<h5 class='text-center mt-2'>Obtener juego</h5>"+
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
        frase += fraseI;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

        comprobarObtenerJuego = true;

    }).fail(function() {

        contMal++;
        frase += fraseI;
        frase = frase + "<p>Resultado obtenido: 500</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

        comprobarObtenerJuego = true;

    }); 

}

function obtenerJuegoMalFormato(){
    var fraseI = "<h5 class='text-center mt-2'>Obtener juego con simbolos</h5>"+
    "<p class='m-0'>URL: /obtenerJuegos/Resident% Evil% 4</p>"+
    "<p class='m-0'>Datos: Nombre del juego</p>"+
    "<p class='m-0'>Tipo: HTTP y consulta api Cheapshark</p>"+
    "<p class='m-0'>Resultado esperado: 500</p>";

    $.ajax({
        method: "PUT",
        url: "/obtenerJuegos/Resident%1 Evil%2 4",
        dataType: "json",
    }).done(function() {

        contMal++;
        frase += fraseI;
        frase += "<p>Resultado obtenido: 200</p>";
        frase += "<i class='bi bi-shield-fill-exclamation text-danger'> No aprobado</i>"

        comprobarObtenerJuego2 = true;

    }).fail(function() {
       
        contBien++;
        frase += fraseI;
        frase += "<p>Resultado obtenido: 500</p>";
        frase += "<i class='bi bi-shield-fill-check text-success'> Aprobado</i>"

        comprobarObtenerJuego2 = true;

    });
}


function empezarTesting(){
    contenido = document.getElementById("contenidoTesting");
     
    div = document.createElement("div");
    frase = document.createElement("div");

    contenido.appendChild(div);

    if(contenido.textContent.length == 132){
        divBarra.setAttribute("class","progress")
        idContador = setInterval(contador, 2);

        top10UnJuego();
        top10Buscando();
        iniciarSesion();
        registrar();
        obtenerJuego();
        obtenerJuegoMalFormato();

        window.setTimeout("darFormato()", 3000);
    }

}


function darFormato(){

    if(comprobarTop10 || comprobarTop10Buscando || comprobarInicio || comprobarRegistro || comprobarObtenerJuego || comprobarObtenerJuego2){
     
        clearInterval(idContador);
        divBarra.setAttribute("class","progress invisible")

        contenido.appendChild(div);
        div.innerHTML = frase.slice(23,frase.length);

        var divFinal = document.createElement("div");
        divFinal.setAttribute("class","text-center");

        contenido.appendChild(divFinal);

        divFinal.innerHTML ="<i class='bi bi-shield-fill-check text-success'> Aprobado = "+contBien+"</i>"+
        "<i class='bi bi-shield-fill-exclamation text-danger ml-3'> No aprobado = "+contMal+"</i>"

    }
}


function main(){
  
    divBarra = document.getElementById("divBarraDeProceso");
    barra = document.getElementById("barraDeProceso");

}


window.onload = main();