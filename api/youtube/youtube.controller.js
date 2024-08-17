import { logger } from '../../services/logger.service.js'
import { youtubeService } from './youtube.service.js'
import { dbService } from '../../services/db.service.js'

export async function getYoutubeId(req, res) {
    const { term, id, artists, title , imgUrl, albumId } = req.query   

    try {
        const collection = await dbService.getCollection('track')

        const existingTrack = await collection.findOneAndUpdate(
            { spotifyId: id },
            {
                $set: { artists, title, imgUrl ,albumId }, 
                $inc: { numsPlayed: 1 } 
            },
            { returnDocument: 'after' } 
        )

        if (existingTrack.value) { 
            const { youtubeId } = existingTrack.value
            res.json({ youtubeId, currApiKeyIdx: 'From DB' })
            return
        }
        else {
            const youtubeApiData = await youtubeService.getYoutubeId(term)
            await collection.insertOne({ spotifyId: id, youtubeId: youtubeApiData.youtubeId , artists , title, imgUrl ,albumId })
            res.json(youtubeApiData)
        }

    } catch (err) {
        logger.error('Cannot get data from YouTube API', err)
        res.status(400).json({ error: 'Failed to get data from YouTube API' })
    }
}