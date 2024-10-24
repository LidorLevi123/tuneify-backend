import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { spotifyRoutes } from './api/spotify/spotify.routes.js'
import { youtubeRoutes } from './api/youtube/youtube.routes.js'
import { stationRoutes } from './api/station/station.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { lyricsRoutes } from './api/lyrics/lyrics.routes.js'
import { wikiRoutes } from './api/wikipedia/wiki.routes.js'
import { loggerRoutes } from './api/log/log.routes.js'
import { ticketmasterRoutes } from './api/events/ticketmaster.routes.js'

// routes
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'
app.all('*', setupAsyncLocalStorage)

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/station', stationRoutes)
app.use('/album', stationRoutes)
app.use('/track', stationRoutes)
app.use('/spotify', spotifyRoutes)
app.use('/youtube', youtubeRoutes)
app.use('/lyrics', lyricsRoutes)
app.use('/wiki', wikiRoutes)
app.use('/log', loggerRoutes)
app.use('/events', ticketmasterRoutes)
setupSocketAPI(server)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/station/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

import { logger } from './services/logger.service.js'

const port = process.env.PORT || 3030
server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})