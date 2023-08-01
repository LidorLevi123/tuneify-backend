import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import {addReview, getReviews, deleteReview} from './review.controller.js'
const router = express.Router()

router.get('/', log, getReviews)
router.post('/',  log, requireAuth, addReview)
router.delete('/:id',  requireAuth, deleteReview)

export const reviewRoutes = router