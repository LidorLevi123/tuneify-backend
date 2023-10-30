import { logger } from '../../services/logger.service.js'
import { spotifyService } from './spotify.service.js'

export async function getSpotifyItems(req, res) {
    try {
        const spotifyItems = await spotifyService.getSpotifyItems(req.query)
        res.send(spotifyItems)
    } catch (err) {
        logger.error('Cannot get spotify items', err)
        res.status(400).send({ err: 'Failed to get spotify items' })
    }
}

export async function getStationsForHome(req, res) {
    try {
        const stations = await spotifyService.getStationsForHome()
        res.send(stations)
    } catch (err) {
        logger.error('Cannot get stations for home', err)
        res.status(400).send({ err: 'Failed to get stations for home' })
    }
}
