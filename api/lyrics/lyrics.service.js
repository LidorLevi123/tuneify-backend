import { Musixmatch } from '@flytri/lyrics-finder'
import Genius from 'genius-lyrics'
import dotenv from 'dotenv'
dotenv.config()

export const lyricsService = {
    getLyrics
}

async function getLyrics(query) {
    try {
        console.log('Trying Musixmatch Api')
        const { lyrics } = await Musixmatch(query)
        if (!lyrics) throw error
        return lyrics
    } catch (error) {
        console.error(error)
        return getLyricsFromGenius(query)
    }
}

async function getLyricsFromGenius(query) {
    const geniusApiKey = process.env.GENIUS_API_KEY
    const Client = new Genius.Client(geniusApiKey)

    try {
        console.log('Musixmatch failed, trying from Genius')
        const res = await Client.songs.search(query)
        const lyricsFromGenius = await res[0].lyrics()
        return lyricsFromGenius

    } catch (error) {
        console.error(error)
    }
}
