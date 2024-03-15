import { logger } from '../../services/logger.service.js'
import { wikiService } from './wiki.service.js'

export async function getArtistData(req, res) {
    const { artist } = req.query
    try {
        const artistSnippet = await wikiService.getWikipediaSnippet(artist)
        res.send(artistSnippet)
    } catch (err) {
        logger.error('Cannot get data from API', err)
        res.status(400).json({ error: 'Failed to get data from API' })
    }
}
