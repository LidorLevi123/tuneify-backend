import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getYoutubeId } from './youtube.controller.js'

const router = express.Router()


router.get('/', log, getYoutubeId)

export const youtubeRoutes = router