const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const path = require('path');

const port = 8080;
const folder = '../temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary
const imagesFolder = 'E:/Personal Projects/music-streamer/temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from our server!')
});

// Route for streaming audio
app.get('/stream/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(folder, filename);
    if (fs.existsSync(file)) {
        const audioStream = fs.createReadStream(file);
        audioStream.pipe(res); // Stream audio file to the client
    } else {
        res.status(404).send('File not found');
    }
});

// Route for serving images
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(imagesFolder, filename); // Adjust to use imagesFolder
    if (fs.existsSync(file)) {
        const imageStream = fs.createReadStream(file);
        imageStream.pipe(res); // Stream image file to the client
    } else {
        res.status(404).send('Image not found');
    }
});

// Routes for other pages
app.get('/albums', (req, res) => {
    res.send('This is the Albums Page');
});

app.get('/artists', (req, res) => {
    res.send('This is the Artist Page');
});

app.get('/playlists', (req, res) => {
    res.send('This is the Playlist Page');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
