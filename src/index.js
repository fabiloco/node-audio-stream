const express = require('express'); // importamos express
const morgan = require('morgan'); // importamos morgan
const cors = require('cors'); // importamos cors

const tracksRoutes = require('./routes/tracks.routes');


// # Inicializaciones #

// ejecutamos express para guardarlo en la variable app
// y poder interactuar con el
const app = express();

// ## middlewares

// le decimos al servidor que use cors para poder
// comunicar el servidor con otros.
app.use(cors());

// le decimos al servidor que use morgan en modo 
// desarrollo para monitorear las peticiones.
app.use(morgan('dev')); 

// ## routes
app.use(tracksRoutes);

// Le asignamos un puerto
app.listen(3000);
console.log('server on port', 3000);
