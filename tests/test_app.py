import pytest
import logging
from backend import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_obtener_juego (client):
    logging.info("Iniciando test para obtener un juego")
    respuesta = client.put('obtenerJuegos/Grand')
    assert respuesta.status_code == 200


def test_juego_no_existente (client):
    logging.info("Iniciando test para obtener un juego que no existe")
    respuesta = client.put('obtenerJuegos/FOFA')
    assert respuesta.status_code == 500


def test_inicio_sesion_incorrecto(client):
    logging.info("Iniciando test para un inicio de sesión incorrecto")
    respuesta = client.put('/iniciarSesion/123;456')
    assert respuesta.status_code == 500


def test_inicio_sesion_correcto(client):
    logging.info("Iniciando test para un inicio de sesión correcto")
    respuesta = client.put('/iniciarSesion/Aitor;TGB123')
    assert respuesta.status_code == 200


def test_registro_juego_incompleto(client):
    logging.info("Iniciando test para intentar registrar un juego incompleto")
    respuesta = client.put('registrarJuego/outlast;steam')
    assert respuesta.status_code == 500

def test_obtener_estadisticas(client):
    logging.info("Iniciando test para obtener estadísticas")
    respuesta = client.get('/obtenerEstadisticas')
    assert respuesta.status_code == 200


def test_registro_usuario_incorrecto(client):
    logging.info("Iniciando test para intentar regristar un usuario de forma incorrecta")
    respuesta = client.put('/registrarUsuario/Aitor;000')
    assert respuesta.status_code == 500

def test_registro_usuario_index_error(client):
    logging.info("Iniciando test para comprobar que se recoge la excepción Index Error al registrar un usuario")
    respuesta = client.put('/registrarUsuario/Aitor')
    assert respuesta.status_code == 500