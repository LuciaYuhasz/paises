//app.js
const express = require('express');
const path = require('path');
const gameRoutes = require('./gameRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Rutas
//app.use('/api', gameRoutes);
// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});



// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));


///      netstat -ano | findstr :3000
////     taskkill /PID 9536 /F