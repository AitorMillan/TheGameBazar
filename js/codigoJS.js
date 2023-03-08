
function mostrarDeals(){
    var juego = document.getElementById("juego").value;
    
    const arrayTiendas = {};
    const ajustes = {
        "async": true,
        "crossDomain": true,
        "url": "",
        "method": "GET",
        "headers": {}
    };

    var url = "https://www.cheapshark.com/api/1.0/stores"
    ajustes["url"] = url;

    $.ajax(ajustes).done(function (tiendas) {
        tiendas.forEach(tienda => {
            arrayTiendas[tienda.storeID] = tienda.storeName;
           });

        var url = "https://www.cheapshark.com/api/1.0/deals?title=" + juego;
        ajustes["url"] = url;

        $.ajax(ajustes).done(function (deals) {
            var tabla = document.getElementById("dealsTabla");
            var info = document.getElementById("informacion");
            if(deals.length != 0){
                tabla.innerHTML = "";
                info.innerHTML = "";

                var columna = tabla.insertRow();
                
                var tituloCol = columna.insertCell();
                tituloCol.innerHTML = "<b>Titulo</b>";
                
                var tiendaCol = columna.insertCell();
                tiendaCol.innerHTML = "<b>Tienda</b>";
                
                var precioCol = columna.insertCell();
                precioCol.innerHTML = "<b>Precio</b>";
                
                var descuentoCol = columna.insertCell();
                descuentoCol.innerHTML = "<b>Descuento</b>";

                deals.forEach(deal => {
                    if (deal.isOnSale == 1){
                        var fila = tabla.insertRow();

                        var tituloFila = fila.insertCell();
                        tituloFila.innerHTML = deal.title;
                        
                        var tiendaFila = fila.insertCell();
                        tiendaFila.innerHTML = arrayTiendas[deal.storeID];
                        
                        var precioFila = fila.insertCell();
                        precioFila.innerHTML = deal.salePrice+"€";
                        
                        var descuentoFila = fila.insertCell();
                        descuentoFila.innerHTML = Math.floor(deal.savings)+"%";
                    }
                });
            }else{
                tabla.innerHTML = "";
                info.innerHTML = "No existe dicho juego en nuesta base de datos, por favor, Inténtelo con otro nombre.";
            }
        }); 
    });	
}