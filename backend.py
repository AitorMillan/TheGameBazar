from flask import Flask, render_template, jsonify, make_response, request, session
from flask_session import Session
import json
import sqlite3
import hashlib
import requests
import os
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = 'usuario'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

CLIENTID = "0c1ev74xgec1iuf5t8whxlk794xltm"
CLIENTSECRET = "tvlnhx3v1w6kenjb6xummy8l6vbr9u"
JUEGOSTOP10 = []
LOG_FORMAT = '%(asctime)s - %(levelname)-7s - %(message)s'


@app.route('/') #pragma: no cover
def index():
    return render_template('index.html')


@app.route('/top10.html') #pragma: no cover
def top10():
    return render_template('top10.html')


@app.route('/iniciarSesion.html') #pragma: no cover
def iniciarSesion():
    if session.get('usuario') != None:
        return render_template('administracion.html')
    else:
        return render_template('iniciarSesion.html')


@app.route('/administracion.html') #pragma: no cover
def administracion():
    if session.get('usuario') != None:
        return render_template('administracion.html')
    else:
        return render_template('index.html') 

@app.route('/obtenerJuegos/<juego>', methods=['PUT'])
def obtenerJuegos(juego):
    try:
        if(juego == "null"):
            juego = ""
        
        url = "https://www.cheapshark.com/api/1.0/deals?title=" + juego

        juegos = requests.request("GET", url, headers={}, data={}, files={})

        tiendas = obtenerTiendas()

        respuestaFinal = darFormatoOfertas(json.loads(juegos.text),tiendas)
        
        return make_response(jsonify(respuestaFinal),200)
    except:
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)


@app.route('/obtenerTop10')
def devolverTop10():
    return make_response(jsonify(JUEGOSTOP10),200)


@app.route('/iniciarSesion/<usuario>', methods=['PUT'])
def obtenerUsuario(usuario):
    try:
        array = usuario.split(";")
        usuario = array[0]
        contrasenia = array[1]
        contraseniaHash = hashlib.sha256(contrasenia.encode('utf-8')).hexdigest()

        conn = sqlite3.connect('GameBazar.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Usuario WHERE id_usuario = ? AND contraseña = ?", (usuario,contraseniaHash))
        result = cursor.fetchone()
        conn.close()

        if len(result) > 0:
            session['usuario'] = result[0]

            return make_response(jsonify({'nombre': result[0]}),200)
    except sqlite3.Error:
        conn.close()
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)
    except TypeError:
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)

@app.route('/cerrarSesion', methods=['GET']) #pragma: no cover
def cerrarSesion():
    try: 
        usuario = session.pop('usuario', None)

        if usuario == None:
            return make_response(jsonify({'resultado': "Error al eliminar la cookie"}),500)
        
        return make_response(jsonify({'resultado': "OK"}),200)
    except:
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)


@app.route('/registrarJuego/<juego>', methods=['PUT'])
def registrarJuego(juego):
    try:
        array = juego.split(";")
        nombreJuego = array[0]
        tienda = array[1]
        fecha = array[2]

        conn = sqlite3.connect('GameBazar.db')
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES (?, ?, ?)", (nombreJuego, tienda, fecha))
        
        conn.commit()
        conn.close()
        
        return make_response(jsonify({'result': "Juego añadido correctamente"}),200)
    except sqlite3.Error:
        conn.close()
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)
    except IndexError:
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)


@app.route('/registrarUsuario/<usuario>', methods=['PUT'])
def registrarUsuario(usuario):
    try:
        array = usuario.split(";")
        usuario = array[0]
        contrasenia = array[1]
        contraseniaHash = hashlib.sha256(contrasenia.encode('utf-8')).hexdigest()

        conn = sqlite3.connect('GameBazar.db')
        cursor = conn.cursor()
    
        cursor.execute("INSERT INTO Usuario (id_usuario, contraseña) VALUES (?, ?)", (usuario,contraseniaHash))

        conn.commit()
        conn.close()

        return make_response(jsonify({'result': "Usuario añadido correctamente"}),200)
    except sqlite3.Error:
        conn.close()
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)
    except IndexError:
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)


@app.route('/obtenerEstadisticas', methods=['GET'])
def obtenerEstadisticas():
    try:
        cabecera = request.headers.get('cabecera')
        query = ""

        if cabecera == "graficaTiendas":
            query = ("SELECT tienda, COUNT(*) AS cuenta "
                "FROM Juego "
                "GROUP BY tienda "
                "ORDER BY tienda DESC "
                "LIMIT 5")
        else:
            query = ("SELECT SUBSTR(fecha_click, 1, 4) AS año, COUNT(*) AS cantidad "
                "FROM Juego "
                "WHERE SUBSTR(fecha_click, 1, 4) IN ('2022', '2023') "
                "GROUP BY SUBSTR(fecha_click, 1, 4)")

        conn = sqlite3.connect('GameBazar.db')
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        conn.close()

        respuesta = darFormatoEstadisticas(result)

        return make_response(jsonify({'Resultado': respuesta}),200)
    except sqlite3.Error:
        conn.close()
        return make_response(jsonify({'resultado': "Error en el servidor"}), 500)


def configurar_logging():
    """Configuramos el logging"""
    logging.basicConfig(
        level=logging.DEBUG,
        format=LOG_FORMAT,
    )


def crearBBDD(): # pragma: no cover
    if not os.path.isfile('GameBazar.db'):
        try:
            conn = sqlite3.connect('GameBazar.db')

            # Creamos la tabla "Usuario" con id_usuario y contraseña
            conn.execute('''CREATE TABLE IF NOT EXISTS Usuario
                    (id_usuario TEXT PRIMARY KEY,
                    contraseña TEXT NOT NULL);''')

            # Creamos la tabla "Juego" con título, tienda y fecha_click
            conn.execute('''CREATE TABLE IF NOT EXISTS Juego
                    (id INTEGER PRIMARY KEY,
                    título TEXT NOT NULL,
                    tienda TEXT NOT NULL,
                    fecha_click TEXT NOT NULL);''')

            # Inertamos datos de ejemplo en la tabla Usuario
            password = hashlib.sha256('TGB123'.encode('utf-8')).hexdigest()
            conn.execute("INSERT INTO Usuario (id_usuario, contraseña) VALUES ('Alex', ?)", (password,))
            conn.execute("INSERT INTO Usuario (id_usuario, contraseña) VALUES ('Jose', ?)", (password,))
            conn.execute("INSERT INTO Usuario (id_usuario, contraseña) VALUES ('Aitor', ?)", (password,))

            # Insertamos datos de ejemplo en la tabla Juego
            conn.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES ('Outlast', 'Steam', '2022-01-01')")
            conn.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES ('Ryse: Son of Rome', 'Steam', '2022-02-15')")
            conn.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES ('The Witcher', 'Steam', '2022-01-15')")
            
            conn.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES ('Resident Evil 4', '2Game', '2023-03-15')")
            conn.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES ('Total War: Troy', 'Epic Games Store', '2023-02-15')")
            conn.execute("INSERT INTO Juego (título, tienda, fecha_click) VALUES ('The Witcher 2: Assassins of Kings Enhanced Edition', 'Steam', '2023-01-15')")

            # Guardamos los cambios y cerramos la conexión
            conn.commit()
            conn.close()
        except sqlite3.Error:
            conn.close()
            logging.ERROR("Error al crear la base de datos")


def obtenerTiendas():
    tiendas = {}

    url = "https://www.cheapshark.com/api/1.0/stores"

    respuesta = requests.request("GET", url, headers={}, data={}, files={})

    respuestaJSON = json.loads(respuesta.text)

    for tienda in respuestaJSON:
        tiendas[int(tienda['storeID'])] = tienda['storeName']

    return tiendas


def obtenerAutorizacion():
    url = "https://id.twitch.tv/oauth2/token?client_id="+CLIENTID+"&client_secret="+CLIENTSECRET+"&grant_type=client_credentials"

    respuesta = requests.request("POST", url, headers={}, data={}, files={})

    return json.loads(respuesta.text)


def obtenerTop10():
    
    url = "https://api.twitch.tv/helix/games/top?first=50"

    autorizacion = obtenerAutorizacion()

    headers = {
        'Client-ID': CLIENTID,
        'Authorization': 'Bearer ' + autorizacion['access_token']
    }

    juegos = requests.request("GET", url, headers=headers, data={}, files={})

    respuestaFinal = darFormatoJuegos(json.loads(juegos.text))

    global JUEGOSTOP10 
    JUEGOSTOP10 = respuestaFinal


def darFormatoJuegos(juegos):
    resultado = "["
    cont = 0
    for juego in juegos['data']:
        if comprobarJuegos(juego['name']) != 0:
            resultado = resultado + '{"Nombre":"'+juego['name']+'","Poster":"'+juego['box_art_url']+'"},'
            cont = cont + 1

        if cont == 10:
            break

    resultado = resultado.rstrip(resultado[-1]) + "]" #Esto es para eliminar la , final

    return json.loads(resultado)


def darFormatoOfertas(juegos,tiendas):
    resultado = "["
    dealURL = ""

    for juego in juegos:
        if int(juego['isOnSale']) == 1:
            dealURL = "https://www.cheapshark.com/redirect?dealID="+juego['dealID']
            resultado = resultado + '{"Nombre":"'+juego['title']+'","Tienda":"'+tiendas[int(juego['storeID'])]+'","Precio":"'+juego['salePrice']+'","Descuento":"'+juego['savings']+'","Enlace":"'+dealURL+'"},'
    
    resultado = resultado.rstrip(resultado[-1]) + "]" #Esto es para eliminar la , final

    return json.loads(resultado)


def darFormatoEstadisticas(datos):
    resultado = "["

    for dato in datos:
        resultado = resultado + '{"NombreMostrar":"'+str(dato[0])+'","Cuenta":"'+str(dato[1])+'"},'

    resultado = resultado.rstrip(resultado[-1]) + "]" #Esto es para eliminar la , final

    return json.loads(resultado)


def comprobarJuegos(juego):
    url = "https://www.cheapshark.com/api/1.0/deals?title=" + juego +"&exact=1"
    
    juegos = requests.request("GET", url, headers={}, data={}, files={})

    return len(json.loads(juegos.text))


#AQUI AÑADIR LO QUE NECESITE EJECUTARSE ANTES QUE EL SERVIDOR DE LA IP

configurar_logging()
logging.info("Preparando servidor...")
obtenerTop10()
logging.info('Archivo de Twitch preparado') 
crearBBDD()
logging.info('Base de datos preparada')
logging.info("¡Servidor preparado!")