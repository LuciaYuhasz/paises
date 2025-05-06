//app.js

const express = require('express');
const path = require('path');
const gameRoutes = require('./gameRoutes');
const { getRankingPage } = require('./rankingController');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuracion motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Carpeta de vistas

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', gameRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/ranking', getRankingPage);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));


