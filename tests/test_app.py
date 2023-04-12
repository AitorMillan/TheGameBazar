import pytest
import logging
from backend import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_obtener_juego (client):
    logging.info("Iniciando test Obtener Juego")
    respuesta = client.put('obtenerJuegos/Outlast')
    assert respuesta.status_code == 200


def test_juego_no_existente (client):
    logging.info("Iniciando test para obtener un juego que no existe")
    respuesta = client.put('obtenerJuegos/FOFA')
    assert respuesta.status_code == 500


def test_inicio_sesion_incorrecto(client):
    logging.info("Iniciando test Inicio Sesión Incorrecto")
    respuesta = client.put('/iniciarSesion/123;456')
    assert respuesta.status_code == 500


def test_inicio_sesion_correcto(client):
    logging.info("Iniciando test Inicio Sesión Correcto")
    respuesta = client.put('/iniciarSesion/Aitor;TGB123')
    assert respuesta.status_code == 200


def test_registro_juego_incompleto(client):
    logging.info("Iniciando test Registro Juego Incompleto")
    respuesta = client.put('registrarJuego/outlast;steam')
    assert respuesta.status_code == 500

def test_obtener_estadisticas(client):
    logging.info("Iniciando test Obtener Estadísticas")
    respuesta = client.get('/obtenerEstadisticas')
    assert respuesta.status_code == 200


def test_registro_usuario_incorrecto(client):
    logging.info("Iniciando test Regristo Usuario Incorrecto")
    respuesta = client.put('/registrarUsuario/Aitor;000')
    assert respuesta.status_code == 500

def test_registro_usuario_index_error(client):
    logging.info("Iniciando test Registro Usuario Index Error")
    respuesta = client.put('/registrarUsuario/Aitor')
    assert respuesta.status_code == 500