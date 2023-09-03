import { logger } from '../../services/logger.service.js'
import { wikiService } from './wiki.service.js'

export async function getArtistData(req, res) {
    const term = req.query[0]

    try {
        const artistSnippet = await wikiService.getWikipediaSnippet(term)
        const artistImage = await wikiService.getArtistImage(term)

        const artistData = {
            artistSnippet,
            artistImage
        }
        res.json(artistData)
    } catch (err) {
        logger.error('Cannot get data from API', err)
        res.status(400).json({ error: 'Failed to get data from API' })
    }
}
