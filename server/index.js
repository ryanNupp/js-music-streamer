const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from our server!')
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
app.listen(8080, () => {
      console.log('server listening on port 8080')
}) 