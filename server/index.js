const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const path = require('path');

const port = 8080;
const folder = '../temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary
const imagesFolder = 'E:/Personal Projects/music-streamer/temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary
const songsFolder = 'E:/Personal Projects/music-streamer/temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary

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

app.get('/app/songs', (req, res) => {
    fs.readdir(songsFolder, (err, files) => {
      if (err) {
        console.error('Error reading songs directory:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Filter out image files based on their extensions
      const songsData = files.filter(file => {
        const fileExtension = path.extname(file).toLowerCase();
        return !['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
      }).map(file => {
        const filePath = path.join(songsFolder, file);
        const { artist, album, songName } = parseSongFilename(file); // Use the function to parse filename
  
        return {
          filename: file,
          artist: artist,
          album: album,
          songName: songName,
          filePath: filePath, // Optional, include any other metadata you need
        };
      });
  
      res.json(songsData); // Send JSON response with songs data
    });
  });
  
  function parseSongFilename(filename) {
    const parts = filename.replace('.mp3', '').split(' - ');
    const artist = parts[0].trim();
    const album = parts[1].trim(); // Assuming album is the second part
    const songName = parts.slice(2).join(' - ').trim(); // Join remaining parts for song name
  
    return { artist, album, songName };
  }
  app.get('/albums/:filename', (req, res) => {
    const requestedAlbum = decodeURIComponent(req.params.filename);
  
    fs.readdir(songsFolder, (err, files) => {
      if (err) {
        console.error('Error reading songs directory:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Filter songs based on the requested album name
      const songsData = files
        .filter(file => {
          const fileExtension = path.extname(file).toLowerCase();
          return !['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
        })
        .filter(file => {
          const { album } = parseSongFilename(file);
          return album === requestedAlbum;
        })
        .map(file => {
          const filePath = path.join(songsFolder, file);
          const { artist, album, songName } = parseSongFilename(file); // Use the function to parse filename
  
          return {
            filename: file,
            artist: artist,
            album: album,
            songName: songName,
            filePath: filePath, // Optional, include any other metadata you need
          };
        });
  
      res.json(songsData); // Send JSON response with filtered songs data for the requested album
    });
  });
  
  function parseSongFilename(filename) {
    const parts = filename.replace('.mp3', '').split(' - ');
    const artist = parts[0].trim();
    const album = parts[1].trim(); // Assuming album is the second part
    const songName = parts.slice(2).join(' - ').trim(); // Join remaining parts for song name
  
    return { artist, album, songName };
  }

// Serve individual images based on filename
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(imagesFolder, filename);

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
