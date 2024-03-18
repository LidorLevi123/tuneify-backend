import { logger } from '../../services/logger.service.js'
import { lyricsService } from './lyrics.service.js'

export async function getLyrics(req, res) {
    const { term } = req.query
    console.log(`Getting lyrics for: ${term}`);

    try {
        const lyrics = await lyricsService.getLyrics(term)
        res.json(lyrics)
    } catch (err) {
        logger.error('Cannot get data from Musixmatch lyrics API', err)
        res.status(400).json({ error: 'Failed to get data from Musixmatch lyrics API' })
    }
}
