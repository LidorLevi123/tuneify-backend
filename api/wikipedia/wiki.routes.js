import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getArtistData } from './wiki.controller.js'

const router = express.Router()

router.get('/', log, getArtistData)

export const wikiRoutes = router