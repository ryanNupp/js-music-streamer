import express from 'express'
import cors from 'cors'
import * as fs from 'node:fs'
import * as path from 'node:path'
import 'dotenv/config'
import checkNewAlbums from './metadata.js'
import * as dbAccess from './localaccess.js'

const PORT = Number(process.env.PORT)
const MUSIC_FOLDER = process.env.MUSIC_FOLDER
const IMAGE_FOLDER = process.env.IMAGE_FOLDER

const app = express()
app.use(cors({
    //origin: "http://10.64.12.97:3000"
}))

// refresh music library, add new albums to db
app.get('/libraryRefresh', () => {  checkNewAlbums()  })

// get all albums
app.get('/albums', (req, res) => {  res.json( dbAccess.getAlbums() )  })

// get details of a specific album
app.get('/albumDetails/:albumfolder', (req, res) => {
    const albumfolder = decodeURIComponent(req.params.albumfolder)
    try {
        const data = dbAccess.getAlbumDetails(albumfolder)
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// get songs off a specified album
app.get('/albumTracks/:albumfolder', (req, res) => {
    const albumfolder = decodeURIComponent(req.params.albumfolder)
    try {
        const songs = dbAccess.getAlbumTracks(albumfolder)
        res.json(songs)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//get track details
app.get('/trackDetails/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename)
    try {
        const trackDetails = dbAccess.getTrackDetails(filename)
        res.json(trackDetails)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//get all tracks
app.get('/tracks', (req, res) => {  res.json( dbAccess.getTracks() )  })

//get all artists 
app.get('/artists', (req, res) => {  res.json( dbAccess.getArtists() )  })

//get albums by artist
app.get('/albumsArtist/:artist', (req, res) => {
    const artists = decodeURIComponent(req.params.artist)
    console.log(artists)
    try {
        const albums = dbAccess.getAlbumsByArtist(artists)
        res.json(albums) // Send albums data as JSON
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Route for streaming audio
app.get('/stream/*', (req, res) => {
    const filepath  = decodeURIComponent(req.params[0])
    const file = path.join(MUSIC_FOLDER, filepath)
    
    if (fs.existsSync(file)) {
        const audioStream = fs.createReadStream(file)
        audioStream.pipe(res) // Stream audio file to the client
    } else {
        res.status(404).send('File not found')
    }
})

// Serve individual images based on filename
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params
    const file = path.join(IMAGE_FOLDER, filename)

    if (fs.existsSync(file)) {
        const imageStream = fs.createReadStream(file)
        imageStream.pipe(res) // Stream image file to the client
    } else {
        res.status(404).send('Image not found')
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
