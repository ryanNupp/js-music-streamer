# js-music-streamer
Self-hosted JavaScript full stack music streaming service. Host backend on your own server, use frontends to connect and stream your own music files as you please.

Backend:
- NodeJS
- ExpressJS
  
Frontend:
- React JS
- Tailwind CSS
- RadixUI
- Uses HTML5 audio elements

Features:
- Utilize locally stored music files to stream from backend to frontend client connections
- Grab music file metadata to store in a local SQLite database file
- Frontend can access metadata from backend to display to the user
- Working queue system to queue up multiple songs to play through
- Client can queue albums or individual songs to play through

Future release features:
- Modify album / track / artist metadata
    - Automatic functionality to pull information from MusicBrainz API
    - Manual input
 
- Mobile app - (potentially react native)
