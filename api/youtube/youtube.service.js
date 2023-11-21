import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const youtubeService = {
    getYoutubeId
}

let currApiKeyIdx = 2

export async function getYoutubeId(term, retryCount = 0) {
    const API_KEYS = process.env.API_KEYS.split(',')
    if (retryCount >= (API_KEYS.length * 2)) return console.log('Tried all api keys unsuccessfully')

    const currApiKey = API_KEYS[currApiKeyIdx]
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${currApiKey}&q=${term}`
    try {
        const response = await axios.get(url)
        console.log(`Got response using api key number: ${currApiKeyIdx}`)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        console.log(`ERROR using api key ${currApiKeyIdx} - trying the next API key`)
        currApiKeyIdx = (currApiKeyIdx + 1) % API_KEYS.length
        return getYoutubeId(term, retryCount + 1)
    }
}
