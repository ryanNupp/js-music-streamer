import { express } from 'express';
import cors from 'cors';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MusicBrainzApi } from 'musicbrainz-api';

const app = express();
const PORT = 8080;
const USER_MUSIC_FOLDER = '../temp_music_collection/Death Grips - Year of the Snitch';
const mbApi = new MusicBrainzApi({
  appName: 'PersonalMusicStreamer',
  appVersion: '0.1.0',
  appMail: 'ryan.nuppenau02@gmail.com'
});

// probably remove this once db & metadata pulling gets workin how we want 
const imagesFolder = '../temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary
const songsFolder = '../temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary

app.use(cors());







// Route for streaming audio
app.get('/stream/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(USER_MUSIC_FOLDER, filename);
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
        const { artist, title } = parseSongFilename(file); // Implement this function
  
        return {
          filename: file,
          artist: artist,
          title: title,
          filePath: filePath, // optional, include any other metadata you need
        };
      });
  
      res.json(songsData);
    });
  });
  
  // Function to parse song filename and extract artist and title
  function parseSongFilename(filename) {
    // Implement your logic to parse the filename and extract artist and title
    // Example logic: Split filename based on delimiter or use regex to extract data
    // Replace with actual logic based on your filenames
    const parts = filename.split('-').map(part => part.trim());
    const artist = parts[0]; // Assuming artist is the first part before the first dash
    const title = parts.slice(1).join(' - ').replace('.mp3', '').trim(); // Join remaining parts and remove file extension
  
    return { artist, title };
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

app.get('/artists', (req, res) => {
    res.send('This is the Artist Page');
});

app.get('/playlists', (req, res) => {
    res.send('This is the Playlist Page');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
