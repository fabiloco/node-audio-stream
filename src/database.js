//const mongodb = require('mongodb'); // importamos el controlador de mongodb
const {MongoClient} = require('mongodb');

let db; // instancia de la database

// Se hace la conexión a la database
MongoClient.connect('mongodb://localhost/tracksdb',{
    useUnifiedTopology: true,
}, (err, client) => {
    if(err) {
        console.log(err);
        process.exit(0);
    }
    // se guarda la instancia de la database 'tracksdb'
    db =  client.db('tracksdb');
    console.log('The database is connected');
});

// Método para poder acceder a la instancia de la database
const getConnection = () => db;

// Exportamos getConnection para poder acceder a la instancia de la db
module.exports = {
    getConnection 
};