
var idContador = ""
var divBarra = ""
var width = 10;
var barra = ""
var info = ""


function contador() {
    width++; 
    barra.setAttribute("style", "width: "+width+"%")
}

function pulsarTecla(event){
    var codigo = event.which || event.keyCode;

    if(codigo === 13){
        mostrarDeals();
    }
}

function mostrarDeals(){
    var juego = document.getElementById("juego").value;
    var tabla = document.getElementById("dealsTabla");

    tabla.innerHTML = "";
    info.innerHTML = "";
    
    divBarra.setAttribute("class","progress")
    idContador = setInterval(contador, 2);
     
    if(juego == ""){
        juego = "null";
    }

    $.ajax({
        method: "PUT",
        url: "/obtenerJuegos/"+juego,
        dataType: "json"
    }).done(function(deals) {
        
        clearInterval(idContador);
        divBarra.setAttribute("class","progress invisible")
               
        var columna = tabla.insertRow();
        
        var tituloCol = columna.insertCell();
        tituloCol.innerHTML = "<b>Titulo</b>";
        
        var tiendaCol = columna.insertCell();
        tiendaCol.innerHTML = "<b>Tienda / Enlace</b>";
        
        var precioCol = columna.insertCell();
        precioCol.innerHTML = "<b>Precio</b>";
        
        var descuentoCol = columna.insertCell();
        descuentoCol.setAttribute("class","d-none d-sm-none d-md-block")
        descuentoCol.innerHTML = "<b>Descuento</b>";

        deals.forEach(deal => {
            var fila = tabla.insertRow();

            var nombreBuscar = deal.Nombre.replace(/\s+/g,"_")

            var tituloFila = fila.insertCell();
            tituloFila.setAttribute("name", nombreBuscar)
            tituloFila.innerHTML = deal.Nombre;
            
            var tiendaFila = fila.insertCell();
            tiendaFila.setAttribute("name", nombreBuscar)
            tiendaFila.innerHTML = "<a href="+deal.Enlace+" rel='external' target='_blank' onclick=registrarJuego('"+nombreBuscar+"')>"+deal.Tienda+"</a>";
            
            var precioFila = fila.insertCell();
            precioFila.innerHTML = deal.Precio+"€"+"<p class='d-sm-block d-md-none mb-0'>Dto: "+Math.floor(deal.Descuento)+"%<p>";
            
            var descuentoFila = fila.insertCell();
            descuentoFila.setAttribute("class","d-none d-sm-none d-md-block")
            descuentoFila.innerHTML = Math.floor(deal.Descuento)+"%";
        });
    }).fail(function() {
        clearInterval(idContador);
        tabla.innerHTML = "";
        divBarra.setAttribute("class","progress invisible")
        info.innerHTML = "No existe dicho juego en nuesta base de datos, por favor, inténtelo con otro nombre.";
    });
}


function obtenerTopJuegos() {
    var tarjetas = document.getElementById("tarjetasZona");

    divBarra.setAttribute("class","progress")
    idContador = setInterval(contador, 2);
    info.innerHTML = "";

    $.ajax({
        method: "GET",
        url: "/obtenerTop10",
        dataType: "json"
    }).done(function(juegos) {

        divBarra.setAttribute("class","progress invisible")
        clearInterval(idContador);
        
        juegos.forEach(juego => {
            var tarjeta = document.createElement("div");
            tarjeta.setAttribute("class","col-12 col-lg-6 col-xl-4 mb-4");

            var cuerpo = document.createElement("div");
            cuerpo.setAttribute("class","card text-center position-relative");

            var colorCabezera = document.createElement("div");
            colorCabezera.setAttribute("class","card-header");
            colorCabezera.setAttribute("style","height: 160px;position: absolute;width: 100%;background-color:#021d34");

            var divImagen = document.createElement("div");
            divImagen.setAttribute("class","divImagen");
            divImagen.setAttribute("style","z-index: 1;text-align: center;");

            var img = document.createElement("img");
            var imagen = juego.Poster;
            imagen = imagen.replace("{width}","150");
            imagen = imagen.replace("{height}","180");
            img.setAttribute("src",imagen);
            img.setAttribute("alt","Imagen del juego de los top10");

            var contenido = document.createElement("div");
            contenido.setAttribute("class","card-body");
            contenido.setAttribute("style","height:100px");

            var titulo = document.createElement("h4");
            titulo.setAttribute("class","card-title");
            titulo.appendChild(document.createTextNode(juego.Nombre));

            tarjetas.appendChild(tarjeta);
            tarjeta.appendChild(cuerpo);
            cuerpo.appendChild(colorCabezera);
            cuerpo.appendChild(divImagen);
            divImagen.appendChild(img);
            cuerpo.appendChild(contenido);
            contenido.appendChild(titulo);
        });
    }).fail(function() {
        divBarra.setAttribute("class","progress invisible")
        clearInterval(idContador);
        info.innerHTML = "Ha habido un problema con el servidor";
    }); 
}

function registrarJuego(nombre){
    var juego = document.getElementsByName(nombre)[0].firstChild.toString();
    var tienda = document.getElementsByName(nombre)[1].firstChild.firstChild.toString();
    
    var fecha = obtenerFecha("ingles","-")

    $.ajax({
        method: "PUT",
        url: "/registrarJuego/"+juego+";"+tienda+";"+fecha,
        dataType: "json"
    }).done(function(resultado) {
        console.log(resultado)
    }).fail(function() {
        console.log("Algo ha fallado")
    });

}


function iniciarSesion(){
    var nombre = document.getElementById("usuario");
    var contra = document.getElementById("pass");
    var errorNombre = document.getElementById("errorUsu");
    var errorContra = document.getElementById("errorContra");

    if(nombre.value == "" || contra.value == ""){
        errorNombre.innerHTML = "Introduce un <b>campo</b> valido";
        errorContra.innerHTML = "Introduce un <b>campo</b> valido";
        nombre.setAttribute("style","border-color: red");
        contra.setAttribute("style","border-color: red");
    }else{
        $.ajax({
            method: "PUT",
            url: "/iniciarSesion/"+nombre.value+";"+contra.value,
            dataType: "json",
        }).done(function(usuario) {
            document.cookie = "usuario ="+ usuario['nombre']+"; expires = " + new Date(2068, 1, 02, 11, 20).toUTCString() + ";Path=/";

            window.location.href = '/'; 
        }).fail(function() {
            errorNombre.innerHTML = "Introduce un <b>campo</b> valido";
            errorContra.innerHTML = "Introduce un <b>campo</b> valido";
            nombre.setAttribute("style","border-color: red");
            contra.setAttribute("style","border-color: red");
        }); 
    }
}


function cerrarSesion(){
    
    var opcion = document.getElementById("OpcionSalir").innerHTML;

    $.ajax({
        method: "GET",
        url: "/cerrarSesion",
        dataType: "json"
    }).done(function(usuario) {
        document.cookie = "usuario=;expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/";

        if(opcion == "Administracion"){
            window.location.href='/';
        }

        crearBoton();
    })
}


function RegistrarAdmin(){
    var nombre = document.getElementById("usuario");
    var contra = document.getElementById("pass");
    var errorNombre = document.getElementById("errorUsu");
    var errorContra = document.getElementById("errorContra");

    if(nombre.value == "" || contra.value == ""){
        errorNombre.innerHTML = "Introduce un <b>campo</b> valido";
        errorContra.innerHTML = "Introduce un <b>campo</b> valido";
        nombre.setAttribute("style","border-color: red");
        contra.setAttribute("style","border-color: red");
    }else{
        $.ajax({
            method: "PUT",
            url: "/registrarUsuario/"+nombre.value+";"+contra.value,
            dataType: "json",
        }).done(function(respuesta) {
            $("#botonCerrarModal").click();

            nombre.value = "";
            contra.value = "";
            
            $("#botonCorrecto").click();
        }).fail(function() {
            errorNombre.innerHTML = "Introduce un <b>campo</b> valido";
            errorContra.innerHTML = "Introduce un <b>campo</b> valido";
            nombre.setAttribute("style","border-color: red");
            contra.setAttribute("style","border-color: red");
        }); 
    }
}


function obtenerFecha(idioma,separador){
    var fecha = new Date()
    var dia = fecha.getDate() < 10 ? 0 + "" + fecha.getDate() : fecha.getDate();
    var mes = (fecha.getMonth() + 1) < 10 ? 0 + "" + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
    var anio = fecha.getFullYear();

    var fechaFinal;

    if(idioma == "ingles"){
        fechaFinal = anio + separador + mes + separador + dia;
    }else{
        fechaFinal = dia + separador + mes + separador + anio;
    }

    return fechaFinal;
}   


function comprobarCookie(nombreValor) {
    var nombre = nombreValor + "=";
    var cookieArray = document.cookie.split(';'); //separo las diferentes cookies que haya

    for(var i = 0; i < cookieArray.length; i++) {
        var palabra = cookieArray[i]; //las cojo una a una
        while (palabra.charAt(0) == ' ') { //quito espacios por si hay antes
            palabra = palabra.substring(1);
        }

        if (palabra.indexOf(nombre) == 0) { //compruebo que la que he cogido es correcta
            return palabra.substring(nombre.length, palabra.length); //devuelto solo el valor
        }
    }
    return "";
}

function irIniciarSesion() {
    window.location.href = '/iniciarSesion.html';
}


function irAdministracion(){
    window.location.href = '/administracion.html';
}


function crearBoton() {
    var menu = document.getElementById("menu");

	var iniciar = document.createElement("button");
	iniciar.setAttribute("type","button");
    iniciar.setAttribute("class","btn botonMismoColor text-white");

    while (menu.firstChild) {
		menu.removeChild(menu.firstChild);
    }

    if(comprobarCookie("usuario") == ""){
        iniciar.addEventListener("click", irIniciarSesion);
	    iniciar.appendChild(document.createTextNode("Iniciar Sesión"));
    }else {
        iniciar.addEventListener("click", cerrarSesion);
        
        var cerrarSes = document.createElement("span");
        cerrarSes.setAttribute("class","d-none d-md-inline");
        cerrarSes.appendChild(document.createTextNode("Cerrar Sesión"));
        iniciar.appendChild(cerrarSes);

        var span = document.createElement("span");
        span.setAttribute("class","d-inline d-md-none fa fa-sign-out");
        iniciar.appendChild(span);
        
        var admin = document.createElement("button");
        admin.setAttribute("id","botonAdmin");
	    admin.setAttribute("type","button");
        admin.setAttribute("class","btn botonMismoColor text-white mr-2");
        admin.addEventListener("click", irAdministracion);
        admin.appendChild(document.createTextNode("Administración"));

        menu.appendChild(admin);
    }

	menu.appendChild(iniciar);
}


function crearGraficas(){
    // Obtener una referencia al elemento canvas del DOM
    const $grafica = document.querySelector("#grafica");
    // Las etiquetas son las porciones de la gráfica
    const etiquetas = ["Steam", "Epic Games", "GOG", "Origin"]
    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datosIngresos = {
        data: [1500, 400, 2000, 7000], // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        // Ahora debería haber tantos background colors como datos, es decir, para este ejemplo, 4
        backgroundColor: [
            'rgba(163,221,203,0.2)',
            'rgba(232,233,161,0.2)',
            'rgba(230,181,102,0.2)',
            'rgba(229,112,126,0.2)',
        ],// Color de fondo
        borderColor: [
            'rgba(163,221,203,1)',
            'rgba(232,233,161,1)',
            'rgba(230,181,102,1)',
            'rgba(229,112,126,1)',
        ],// Color del borde
        borderWidth: 1,// Ancho del borde
    };
    new Chart($grafica, {
        type: 'pie',// Tipo de gráfica. Puede ser dougnhut o pie
        data: {
            labels: etiquetas,
            datasets: [
                datosIngresos,
                // Aquí más datos...
            ]
        },
    });
}


function main(){
    crearBoton();
    
    divBarra = document.getElementById("divBarraDeProceso");
    barra = document.getElementById("barraDeProceso");
    info = document.getElementById("informacion");

    if(document.URL.includes("top10.html")){
        obtenerTopJuegos();
    }

    if(document.URL.includes("administracion.html")){
        var textoAdmin = document.getElementById("NombreAdmin");
        textoAdmin.innerHTML = "<b>Usuario:</b> "+ comprobarCookie("usuario");

        var textoFecha = document.getElementById("DiaAdmin");
        textoFecha.innerHTML = "<b>Día:</b> "+ obtenerFecha("español","/");

        crearGraficas();
    }

}

window.onload = main();