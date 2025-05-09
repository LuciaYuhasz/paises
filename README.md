# paisespregunta

PaisesPregunta es una aplicación web que pone a prueba el conocimiento sobre los países del mundo a través de preguntas aleatorias. Las preguntas pueden abarcar capitales, banderas y fronteras, con un sistema de puntos y un ranking para comparar resultados.


##  Tecnologías utilizadas
Frontend: HTML, CSS, Bootstrap, JavaScript

Backend: Node.js (v20.x), Express (^5.1.0)

Motor de plantillas: Pug (^3.0.3)

API externa: REST Countries API

Persistencia: JSON local en el servidor

Modularización: Código estructurado en módulos para facilitar mantenimiento


## Estructura del proyecto


├── app.js               → Archivo principal del servidor
├── gameRoutes.js        → Rutas para lógica del juego
├── rankingController.js → Controlador para la lógica de ranking
├── public/              → Archivos estáticos (JS, CSS, imágenes)
│   └── js/
│       ├── game.js      → Lógica principal del juego en el cliente
│       ├── ui.js        → Control de interfaz de usuario
│       ├── sounds.js    → Manejo de sonidos
│       └── style/       → Estilos CSS personalizados
├── views/               → Vistas Pug (index, ranking, layout)
├── data/
│   └── ranking.json     → Archivo donde se guarda el ranking
├── package.json         → Configuración del proyecto y scripts


##  Características principales

- Registro con nombre de usuario

- 10 preguntas aleatorias por partida
- Tipos de preguntas:
    capitales ( suman 3 puntos)
    bandera del pais que se muestra( suma 5 puntos)
    cantidad de paises fronterizos ( suma 3 puntos)

- 4 opciones por pregunta

- Traducción en los nombres de la API (cuando están disponibles)

- Indicador de acierto/error y respuesta correcta

- Música de fondo con opción de silenciar y sonidos para eventos del juego

- Pistas disponibles durante el juego ( en los casos en que la pregunta no es sobre banderas)

- Ranking con las 20 mejores partidas (por puntaje y tiempo)

- Estadísticas finales: respuestas correctas/incorrectas, duración total, promedio por pregunta


##  Acceso a la aplicacion en linea 
La aplicación está desplegada y accesible en:

##  Mecanismos de comunicacion
Se usa fetch en el frontend para enviar datos al servidor a través de solicitudes HTTP. Express maneja las rutas y recibe los datos enviados en formato JSON. Los datos del ranking se persisten utilizando el módulo fs de Node. js, almacenando los puntajes en un archivo ranking.json.


Endpoints del servidor
- POST /api/submit-score   → Guarda un nuevo puntaje en el ranking  
- GET  /ranking            → Obtiene los mejores puntajes del ranking  
El servidor procesa la lógica del ranking, ordena los datos y los persiste en ranking.json. El frontend envía solicitudes para mostrar los resultados y actualizar la interfaz. 