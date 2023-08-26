import { logger } from '../../services/logger.service.js'
import { youtubeService } from './youtube.service.js'


export async function getYoutubeId(req, res) {
    const term = req.query[0]

    try {
        const youtubeData = await youtubeService.getYoutubeId(term)
        res.json(youtubeData.items[0].id.videoId)
    } catch (err) {
        logger.error('Cannot get data from YouTube API', err)
        res.status(400).json({ error: 'Failed to get data from YouTube API' })
    }
}