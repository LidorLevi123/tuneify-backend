import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getLyrics } from './lyrics.controller.js'


const router = express.Router()

router.get('/', log, getLyrics)

export const lyricsRoutes = router