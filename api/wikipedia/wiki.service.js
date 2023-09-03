import axios from 'axios'

export const wikiService = {
    getArtistImage,
    getWikipediaSnippet
}
async function getArtistImage(query) {
    try {
        const apiUrl = `https://api.deezer.com/search/artist?q=${query}`
        const response = await axios.get(apiUrl)

        if (response.status !== 200) {
            throw new Error('Network response was not ok')
        }

        const data = response.data.data

        if (data && data.length > 0) {
            return data[0].picture_big
        } else {
            console.log('No matching artist found.')
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

async function getWikipediaSnippet(searchQuery) {
    try {

        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${encodeURIComponent(searchQuery)}`

        const response = await axios.get(apiUrl)

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const pages = response.data.query.pages
        const pageId = Object.keys(pages)[0]
        const snippet = pages[pageId].extract

        if (!snippet) {
            console.log('No matching articles found')
        } else {
            return snippet
        }
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}
