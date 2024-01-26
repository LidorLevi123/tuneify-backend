import axios from 'axios'
import dotenv from 'dotenv'
import { logger } from '../../services/logger.service.js'
dotenv.config()

export const youtubeService = {
    getYoutubeId
}

let currApiKeyIdx = 0

export async function getYoutubeId(term, retryCount = 0) {
    const API_KEYS = process.env.API_KEYS.split(',')
    if (retryCount >= (API_KEYS.length * 2)) return logger.error('Tried all api keys unsuccessfully')

    const currApiKey = API_KEYS[currApiKeyIdx]
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${currApiKey}&q=${term}`
    try {
        const { data } = await axios.get(url)
        const youtubeId = data.items[0].id.videoId
        console.log(`Got response using api key number: ${currApiKeyIdx}`)
        return { youtubeId, currApiKeyIdx }
    } catch (error) {
        console.error('Error fetching data:', error)
        console.log(`ERROR using api key ${currApiKeyIdx} - trying the next API key`)
        logger.error(`ERROR using api key ${currApiKeyIdx} - trying the next API key`)
        currApiKeyIdx = (currApiKeyIdx + 1) % API_KEYS.length
        return getYoutubeId(term, retryCount + 1)
    }
}