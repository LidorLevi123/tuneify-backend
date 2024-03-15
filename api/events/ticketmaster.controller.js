import { logger } from '../../services/logger.service.js'
import { ticketmasterService } from './ticketmaster.service.js'

export async function getEventsAndSocials(req, res) {
    const { artist } = req.query
    try {
        const eventsAndSocials = await ticketmasterService.getEventsAndSocials(artist)
        res.json(eventsAndSocials)
    } catch (err) {
        logger.error('Cannot get event and socials', err)
        res.status(400).send({ err: 'Failed to get events and socials' })
    }
}
