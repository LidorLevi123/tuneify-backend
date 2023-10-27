import axios from 'axios'

export const wikiService = {
    getWikipediaSnippet
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
