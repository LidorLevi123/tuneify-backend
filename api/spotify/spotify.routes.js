import express from 'express'

import { log } from '../../middlewares/logger.middleware.js'
import { getSpotifyItems } from './spotify.controller.js'

const router = express.Router()

router.get('/', log, getSpotifyItems)

export const spotifyRoutes = router