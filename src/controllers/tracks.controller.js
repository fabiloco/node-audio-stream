// # Métodos a ejecutar en las rutas

const multer = require('multer'); // importamos multer para poder manejar los archivos de audio
const { getConnection } = require('../database');
const { GridFSBucket, ObjectID } = require('mongodb');
const {Readable} = require('stream');


const getTrack = (req, res) => {
    
    let trackID;

    try {
        trackID = new ObjectID(req.params.trackID);
    } catch (err) {
        return res.status(400).json({message:'Invalid track ID in URL.'});
    }

    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    const db = getConnection();

    const bucket = new GridFSBucket(db, {
        bucketName: 'tracks',
    });

    let dowloadStream = bucket.openDownloadStream(trackID);
    
    dowloadStream.on('data', chunk => {
        res.write(chunk);
    });

    dowloadStream.on('error', () => {
        res.sendStatus(404);
    });

    dowloadStream.on('end', () => {
        res.end();
    });
};

const uploadTrack = (req, res) => {
    const storage = multer.memoryStorage(); // le indicamos a milter que utilize la memoria para guardar los archivos (Buffer)
    
    const upload = multer({
        //storage: storage, -> es lo mismo
        storage,
        limits: { // limites de la subida
            fields: 1, // campos adicionales al archivo
            fileSize: 6000000, // tamaño -> 6 megas
            files: 1, // cuantos archivos se van a subir al mismo tiempo
            parts:2 // las partes de la información. En este caso son dos tipos, el archivo y el nombre de la canción.
        },
    });

    // método single permite escuchar cuando un archivo se ha subido. Recibe como parametro el nombre del archivo
    upload.single('track')(req, res, (err) => {
        if(err) {
            console.log(err);
            return res.status(400).json({message: err.message});
        } else if(!req.body.name) {
            return res.status(400).json({message: 'No track name in request body'});
        }

        let trackName = req.body.name;

        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);

        const db = getConnection();
        const bucket = new GridFSBucket(db, {
            bucketName: 'tracks',
        });

        let uploadString = bucket.openUploadStream(trackName);
        const id = uploadString.id;
        readableTrackStream.pipe(uploadString);

        uploadString.on('error', () => {
            return res.status(500).json({message: 'Error uploading your file'});
        });

        uploadString.on('finish', () => {
            return res.status(201).json({message: 'File upload successfully, stored under ID: ' + id});
        });

    });    
};

module.exports = {
    getTrack,
    uploadTrack,
};