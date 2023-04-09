function crearAdvertenciaCookie(){
  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#1c2833",
        "text": "#ffffff"
      },
      "button": {
        "background": "#f1d600",
        "text": "#000000"
      }
    },
    "content": {
      "message": "Este sitio web utiliza cookies para garantizar que obtenga la mejor experiencia en nuestro sitio web.",
      "dismiss": "Aceptar",
      "link": "Leer más"
    }
  });
}

window.onload = crearAdvertenciaCookie();