import { logger } from '../../services/logger.service.js'
import { youtubeService } from './youtube.service.js'
import { dbService } from '../../services/db.service.js'

export async function getYoutubeId(req, res) {
    const { term, trackId } = req.query

    try {
        const collection = await dbService.getCollection('track')

        const existingTrack = await collection.findOne({ spotifyId: trackId })

        if (existingTrack) {
            const { youtubeId } = existingTrack
            res.json({ youtubeId, currApiKeyIdx: 'From DB' })
            return
        }
        else {
            const youtubeApiData = await youtubeService.getYoutubeId(term)
            await collection.insertOne({ spotifyId: trackId, youtubeId: youtubeApiData.youtubeId })
            res.json(youtubeApiData)
        }

    } catch (err) {
        logger.error('Cannot get data from YouTube API', err)
        res.status(400).json({ error: 'Failed to get data from YouTube API' })
    }
}