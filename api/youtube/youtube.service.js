import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const youtubeService = {
    getYoutubeId
}

let currApiKeyIdx = 0

export async function getYoutubeId(term, retryCount = 0) {
    if (retryCount > 5) return
    const API_KEYS = process.env.API_KEYS.split(',')

    const currApiKey = API_KEYS[currApiKeyIdx]
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${currApiKey}&q=${term}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        currApiKeyIdx = (currApiKeyIdx + 1) % API_KEYS.length
        console.log('Switching to the next API key.')
        return getYoutubeId(term, retryCount + 1)
    }
}