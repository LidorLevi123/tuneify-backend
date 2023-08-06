import { logger } from '../../services/logger.service.js'
import { spotifyService } from './spotify.service.js'

export async function getAccessToken(req, res) {
    try {
        const accessToken = await spotifyService.getAccessToken()
        res.send(accessToken)
    } catch (err) {
        logger.error('Cannot get access token', err)
        res.status(400).send({ err: 'Failed to get access token' })
    }
}