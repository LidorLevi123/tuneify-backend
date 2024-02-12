import express from 'express'

import { log } from '../../middlewares/logger.middleware.js'
import { getSpotifyItems, getStationsForHome } from './spotify.controller.js'

const router = express.Router()

router.get('/', log, getSpotifyItems)
router.get('/home/:market', log, getStationsForHome)

export const spotifyRoutes = router