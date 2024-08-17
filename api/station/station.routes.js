import express from 'express'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getStations, getStationById, addStation, updateStation, removeStation, getAllStations, removeStationsByName, getTopTen } from './station.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getStations)
router.get('/getall', requireAuth, requireAdmin, getAllStations)
router.get('/topten', getTopTen)
router.get('/:id', getStationById)
router.post('/', requireAuth, addStation)
router.put('/:id', requireAuth, updateStation)
router.delete('/byname/:name', requireAuth, requireAdmin, removeStationsByName)
router.delete('/byid/:id', requireAuth, removeStation)

export const stationRoutes = router
