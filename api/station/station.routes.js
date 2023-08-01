import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getStations, getStationById, addStation, updateStation, removeStation, addStationMsg, removeStationMsg } from './station.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getStations)
router.get('/:id', getStationById)
router.post('/', requireAuth, addStation)
router.put('/:id', requireAuth, updateStation)
router.delete('/:id', requireAuth, removeStation)
// router.delete('/:id', requireAuth, requireAdmin, removeStation)

router.post('/:id/msg', requireAuth, addStationMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeStationMsg)

export const stationRoutes = router
