import express from 'express'

import { log } from '../../middlewares/logger.middleware.js'
import { getAccessToken } from './spotify.controller.js'

const router = express.Router()

router.get('/', log, getAccessToken)

export const spotifyRoutes = router