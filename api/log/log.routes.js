import express from 'express'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getBackendLog } from './log.controller.js'

const router = express.Router()

router.get('/', requireAuth, requireAdmin, getBackendLog)

export const loggerRoutes = router