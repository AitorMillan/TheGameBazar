from flask import Flask, render_template, jsonify
import json
import requests

app = Flask(__name__)

CLIENTID = "0c1ev74xgec1iuf5t8whxlk794xltm";
CLIENTSECRET = "tvlnhx3v1w6kenjb6xummy8l6vbr9u";

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/top10.html')
def top10():
    return render_template('top10.html')

@app.route('/obtenerJuegos/<juego>', methods=['PUT'])
def obtenerJuegos(juego):
    print("hola")
    if(juego == "null"):
        juego = ""
    
    url = "https://www.cheapshark.com/api/1.0/deals?title=" + juego

    juegos = requests.request("GET", url, headers={}, data={}, files={})

    tiendas = obtenerTiendas()
    
    respuestaFinal = darFormatoOfertas(json.loads(juegos.text),tiendas)
    print("adios")
    return jsonify(respuestaFinal)

@app.route('/obtenerTop10')
def obtenerTop10():
    url = "https://api.twitch.tv/helix/games/top?first=25"

    autorizacion = obtenerAutorizacion()

    headers = {
        'Client-ID': CLIENTID,
        'Authorization': 'Bearer ' + autorizacion['access_token']
    }

    juegos = requests.request("GET", url, headers=headers, data={}, files={})

    respuestaFinal = darFormatoJuegos(json.loads(juegos.text))

    return jsonify(respuestaFinal)

def obtenerTiendas():
    tiendas = {}

    url = "https://www.cheapshark.com/api/1.0/stores"

    respuesta = requests.request("GET", url, headers={}, data={}, files={})

    respuestaJSON = json.loads(respuesta.text)

    for tienda in respuestaJSON:
        tiendas[int(tienda['storeID'])] = tienda['storeName']

    return tiendas

def darFormatoOfertas(juegos,tiendas):
    resultado = "["

    print(juegos)

    for juego in juegos:
        #if int(juego['isOnSale']) == 1:
        resultado = resultado + '{"Nombre":"'+juego['title']+'","Tienda":"'+tiendas[int(juego['storeID'])]+'","Precio":"'+juego['salePrice']+'","Descuento":"'+juego['savings']+'"},'
    
    resultado = resultado.rstrip(resultado[-1]) + "]" #Esto es para eliminar la , final

    return json.loads(resultado)

def obtenerAutorizacion():
    url = "https://id.twitch.tv/oauth2/token?client_id="+CLIENTID+"&client_secret="+CLIENTSECRET+"&grant_type=client_credentials"

    respuesta = requests.request("POST", url, headers={}, data={}, files={})

    return json.loads(respuesta.text)

def darFormatoJuegos(juegos):
    resultado = "["

    for juego in juegos['data']:
        resultado = resultado + '{"Nombre":"'+juego['name']+'","Poster":"'+juego['box_art_url']+'"},'

    resultado = resultado.rstrip(resultado[-1]) + "]" #Esto es para eliminar la , final

    return json.loads(resultado)

