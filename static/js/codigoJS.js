
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
        precioCol.innerHTML = "<b>Precio </b>";

        var iconAbajoT = document.createElement("i");
        iconAbajoT.setAttribute("class","bi bi-caret-down-fill ml-3 ml-md-0");
        iconAbajoT.setAttribute("id","abajoprecio");
        iconAbajoT.setAttribute("onclick","ordenarBoton('abajo','precio')");

        var iconArribaT = document.createElement("i");
        iconArribaT.setAttribute("class","bi bi-caret-up-fill ml-3 ml-md-0 d-none");
        iconArribaT.setAttribute("id","arribaprecio")
        iconArribaT.setAttribute("onclick","ordenarBoton('arriba','precio')");

        precioCol.appendChild(iconAbajoT);
        precioCol.appendChild(iconArribaT);

        var descuentoCol = columna.insertCell();
        descuentoCol.setAttribute("class","d-none d-sm-none d-md-block")
        descuentoCol.innerHTML = "<b>Descuento </b>";

        var iconAbajoD = document.createElement("i");
        iconAbajoD.setAttribute("class","bi bi-caret-down-fill");
        iconAbajoD.setAttribute("id","abajodescuento");
        iconAbajoD.setAttribute("onclick","ordenarBoton('abajo','descuento')");

        var iconArribaD = document.createElement("i");
        iconArribaD.setAttribute("class","bi bi-caret-up-fill d-none");
        iconArribaD.setAttribute("id","arribadescuento")
        iconArribaD.setAttribute("onclick","ordenarBoton('arriba','descuento')");

        descuentoCol.appendChild(iconAbajoD);
        descuentoCol.appendChild(iconArribaD);

        deals.forEach(deal => {
            var fila = tabla.insertRow();

            var nombreBuscar = deal.Nombre.replace(/\s+/g,"_")

            var tituloFila = fila.insertCell();
            tituloFila.setAttribute("name", nombreBuscar)
            tituloFila.innerHTML = deal.Nombre;
            
            var tiendaFila = fila.insertCell();
            tiendaFila.setAttribute("name", nombreBuscar)
            
            var url = document.createElement("a");
            url.setAttribute("href", deal.Enlace);
            url.setAttribute("rel","external");
            url.setAttribute("target","blank");
            url.setAttribute("name",nombreBuscar)
            url.addEventListener("mouseup",registrarJuegoRaton);
            url.innerHTML = deal.Tienda;

            tiendaFila.appendChild(url);

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
    var contadorImg = 1;
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
            
            var imagenPuntuacionD = document.createElement("img");

            if(contadorImg < 4) {
                img.setAttribute("class","ml-5")

                imagenPuntuacionD.setAttribute("src","static/img/medalla"+contadorImg+".png")
                imagenPuntuacionD.setAttribute("id","imagenPutuacion");
                imagenPuntuacionD.setAttribute("class","ml-2")

                contadorImg++;
            }else {
                img.setAttribute("class","mt-3")
            }

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
            divImagen.appendChild(imagenPuntuacionD);
            cuerpo.appendChild(contenido);
            contenido.appendChild(titulo);
        });
    }).fail(function() {
        divBarra.setAttribute("class","progress invisible")
        clearInterval(idContador);
        info.innerHTML = "Ha habido un problema con el servidor";
    }); 
}


function registrarJuegoRaton(e){
    if (e.button === 1 || e.button === 0){ //Cuando se pulsa el medio y el izquierdo
        registrarJuego(e.toElement.name)
    }
}


function registrarJuego(nombre){
    var juego = document.getElementsByName(nombre)[0].firstChild.textContent;
    var tienda = document.getElementsByName(nombre)[1].firstChild.firstChild.textContent;
    
    var fecha = obtenerFecha("ingles","-");

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
            url: "/iniciarSesion/"+nombre.value.charAt(0).toUpperCase() + nombre.value.slice(1)+";"+contra.value,
            dataType: "json",
        }).done(function(usuario) {
            document.cookie = "usuario ="+ usuario['nombre']+"; expires = " + new Date(2068, 1, 02, 11, 20).toUTCString() + ";Path=/";

            window.location.href = '/administracion.html'; 
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
            url: "/registrarUsuario/"+nombre.value.charAt(0).toUpperCase() + nombre.value.slice(1)+";"+contra.value,
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


function ordenarBoton(orden,tipo){
    var elemento = document.getElementById(orden+tipo);
    var numColumna;

    if(orden === "abajo"){
        var elementoArriba = document.getElementById("arriba"+tipo);
        elementoArriba.setAttribute("class","bi bi-caret-up-fill ml-3 ml-md-0");
        elemento.setAttribute("class","bi bi-caret-down-fill ml-3 ml-md-0 d-none");

        if(tipo === "precio"){
            numColumna = 2;
        }else{
            numColumna = 3;
        }

        ordenarTabla(numColumna,"ascendente");
    
    }else{
        var elementoAbajo = document.getElementById("abajo"+tipo);
        elementoAbajo.setAttribute("class","bi bi-caret-down-fill ml-3 ml-md-0");
        elemento.setAttribute("class","bi bi-caret-up-fill ml-3 ml-md-0 d-none");
        
        if(tipo === "precio"){
            numColumna = 2;
        }else{
            numColumna = 3;
        }

        ordenarTabla(numColumna,"descendente");
        
    }

}


function ordenarTabla(columna,tipo){
    var tabla, filas, entrar, i, x, y, cambiador;
    tabla = document.getElementById("dealsTabla");
    entrar = true;

    while (entrar) {
        entrar = false;

        filas = tabla.rows;

        for (i = 1; i < (filas.length - 1); i++) {
            cambiador = false;
        
            x = parseFloat(filas[i].getElementsByTagName("TD")[columna].firstChild.textContent.slice(0,-1));
            y = parseFloat(filas[i + 1].getElementsByTagName("TD")[columna].firstChild.textContent.slice(0,-1));

            if (x > y && tipo === "ascendente") {
                cambiador = true;
                break;
            }

            if(x < y && tipo === "descendente"){
                cambiador = true;
                break;
            }

        }

        if(cambiador){
            filas[i].parentNode.insertBefore(filas[i + 1], filas[i]);
            entrar = true;
        }
    }
}


function crearCirculoTiendas(datos){
    $.ajax({
        method: "GET",
        url: "/obtenerEstadisticas",
        dataType: "json",
        headers: {
            "cabecera": "graficaTiendas"
        }
    }).done(function(respuesta) {
        nombresTiendas = []
        cuentaTiendas = []
        cont = 0;

        respuesta['Resultado'].forEach(dato => {
            nombresTiendas[cont] = dato['NombreMostrar'];
            cuentaTiendas[cont] = dato['Cuenta']
            cont++;
        });

        const $grafica = document.querySelector("#circulo");
        const etiquetas = nombresTiendas;

        const datosTiendas = {
            data: cuentaTiendas,
            backgroundColor: [
                'rgba(176,224,230,0.2)',
                'rgba(0,191,255,0.2)',
                'rgba(70,130,180,0.2)',
                'rgba(0,0,128,0.2)',
                'rgba(106,90,205,0.2)',
            ],
            borderColor: [
                'rgba(176,224,230,1)',
                'rgba(0,191,255,1)',
                'rgba(70,130,180,1)',
                'rgba(0,0,128,1)',
                'rgba(106,90,205,1)',
            ],
            borderWidth: 1,
        };
        new Chart($grafica, {
            type: 'pie',
            data: {
                labels: etiquetas,
                datasets: [
                    datosTiendas,
                ]
            },
        });
    }).fail(function() {
        console.log("Ha habido un problema")
    });
}

function crearBarrasAnios(){
    $.ajax({
        method: "GET",
        url: "/obtenerEstadisticas",
        dataType: "json",
        headers: {
            "cabecera": "graficaAnios"
        }
    }).done(function(respuesta) {

        var datos2022 = respuesta['Resultado'][0]['NombreMostrar'] == "2022" ? respuesta['Resultado'][0]['Cuenta'] : respuesta['Resultado'][1]['Cuenta'];;
        var datos2023 = respuesta['Resultado'][0]['NombreMostrar'] == "2023" ? respuesta['Resultado'][0]['Cuenta'] : respuesta['Resultado'][1]['Cuenta'];

        const $grafica = document.querySelector("#barras");
        const etiquetas = [""] //Etiquetas eje X. 

        const datosClick2023 = {
            label: "Clicks en 2023",
            data: [datos2023], 
            backgroundColor: 'rgba(70,130,180, 0.2)',
            borderColor: 'rgba(70,130,180, 1)',
            borderWidth: 1,
        };

        const datosClick2022 = {
            label: "Clicks en 2022",
            data: [datos2022], 
            backgroundColor: 'rgba(25,25,112, 0.2)', 
            borderColor: 'rgba(25,25,112, 1)', 
            borderWidth: 1,
        };

        new Chart($grafica, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [
                    datosClick2023,
                    datosClick2022,
                ]
            },
        });
    }).fail(function() {
        console.log("Ha habido un problema")
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

        crearCirculoTiendas();
        crearBarrasAnios();
    }

}

window.onload = main();
