import express from 'express'
import { getEventsAndSocials } from './ticketmaster.controller.js'

const router = express.Router()

router.get('/', getEventsAndSocials)

export const ticketmasterRoutes = router