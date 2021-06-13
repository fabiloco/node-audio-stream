// # manejador de rutas

const { Router } = require('express'); // importamos desde express el método router
const router = Router(); // instanciamos ese router

// importamos los controladores para los metodos http get y post
const { getTrack, uploadTrack } = require('../controllers/tracks.controller'); 

// cuanto la ruta reciba una petición get en la ruta 'tracks/:tracksID', ejecutará getTrack
router.get('/tracks/:trackID', getTrack);

// cuanto la ruta reciba una petición post en la ruta '/tracks', ejecutará uploadTrack
router.post('/tracks', uploadTrack);

// se exporta el router
module.exports = router;