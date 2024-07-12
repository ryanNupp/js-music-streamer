const express = require('express');
const cors = require('cors');
// const multer = require('multer');  // this will be used for 
const fs = require('fs');
const app = express();

const port = 8080; // port variable -- TODO: let user choose custom port
const folder = '../temp_music_collection/Death Grips - Year of the Snitch';

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from our server!')
})

// routes for streaming
app.get('/stream/:filename', (req, res) => {
    const { filename } = req.params;
    const file = `${folder}/${filename}`;
    if (fs.existsSync(file)) {
        const audioStream = fs.createReadStream(file);
        audioStream.pipe(res); // Stream audio file to the client
    } else {
        res.status(404).send('File not found');
    }
})

//making gets for pages Albums, Artists and playlists?
app.get('/albums', (req, res) => {
    res.send('This is the Albums Page')
})
app.get('/artists', (req, res) => {
    res.send('This is the Artist Page')
})
app.get('/playlists', (req, res) => {
    res.send('This is the playlist Page')
})

// Start server
app.listen(port, () => {
      console.log(`server listening on port ${port}`)
}) 