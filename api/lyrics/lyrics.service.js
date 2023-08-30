import { Google, Musixmatch } from '@flytri/lyrics-finder'

export const lyricsService = {
    getLyrics
}
async function getLyrics(query) {
    try {
        const { lyrics } = await Musixmatch(query)
        return lyrics

    } catch (error) {
        console.error(error)
    }
}


