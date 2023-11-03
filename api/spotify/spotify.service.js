import axios from 'axios'
import dotenv from 'dotenv'
import { logger } from '../../services/logger.service.js'
dotenv.config()

export const spotifyService = {
    getSpotifyItems,
    getStationsForHome,
}

let gAccessToken = await getAccessToken()
setTokenRefreshInterval()
async function getAccessToken() {
    try {
        // Encode client credentials (Client ID and Client Secret)
        const credentials = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        const encodedCredentials = Buffer.from(credentials).toString('base64')

        // Make a POST request to the token endpoint
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${encodedCredentials}`,
                },
            }
        )
        // Extract and return the access token from the response
        const { data } = response

        return data.access_token
    } catch (err) {
        console.error(
            'Error retrieving access token:',
            err.response ? err.response.data : err.message
        )
        throw err
    }
}

function setTokenRefreshInterval() {
    setInterval(async () => {
        try {
            gAccessToken = await getAccessToken()
            logger.info('Access token refreshed.')
        } catch (error) {
            console.error('Error refreshing access token:', error)
        }
    }, 3300000)
}

async function getSpotifyItems(req) {
    const { type, id, query } = req
    if (!gAccessToken) gAccessToken = await getAccessToken()

    const endpoints = _getEndpoints(id, query)

    try {
        // Make a GET request to the Spotify API endpoint
        const response = await axios.get(endpoints[type], {
            headers: {
                Authorization: `Bearer ${gAccessToken}`,
            },
        })
        // Clean and return the data from response
        let cleanData = await _cleanResponseData(response.data, type)
        return cleanData

    } catch (error) {
        console.error(
            'Error retrieving data:',
            error.response ? error.response.data : error.message,
            'Status Code:',
            error.response ? error.response.status : 'N/A',
            'Headers:',
            error.response ? error.response.headers : 'N/A'
        )
        throw error
    }
}

function _getEndpoints(id, query) {
    return {
        categoryStations: `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=il&limit=50`,
        featured: `https://api.spotify.com/v1/browse/featured-playlists?country=IL&locale=he_IL&limit=50`,
        station: `https://api.spotify.com/v1/playlists/${id}`,
        tracks: `https://api.spotify.com/v1/playlists/${id}/tracks`,
        search: `https://api.spotify.com/v1/search?q=${query}&type=track,playlist,album&limit=20`,
        artist: `https://api.spotify.com/v1/artists/${id}`,
        album: `https://api.spotify.com/v1/albums/${id}`,
    }
}

async function _cleanResponseData(data, type) {
    let cleanData

    switch (type) {
        case 'categoryStations':
        case 'featured':
            cleanData = _cleanCategoryStationsData(data)
            break
        case 'tracks':
            cleanData = _cleanStationTracksData(data)
            break
        case 'station':
            cleanData = await _cleanStationData(data)
            break
        case 'search':
            cleanData = await _cleanSearchData(data)
            break
        case 'artist':
            cleanData = await _cleanArtistData(data)
            break
        case 'album':
            cleanData = _cleanAlbumData(data)
    }
    return cleanData
}

async function _cleanStationData(data) {
    const station = {
        spotifyId: data.id,
        name: data.name,
        imgUrl: data.images[0].url,
        description: data.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, ''),
        owner: { fullname: 'Tuneify' },
        tracks: await getSpotifyItems({ type: 'tracks', id: data.id }),
    }
    return station
}

function _cleanAlbumData(data) {
    return {
        spotifyId: data.id,
        name: data.name,
        imgUrl: data.images[0].url,
        releaseDate: data.release_date,
        artists: _cleanArtists(data.artists),
        owner: { fullname: data.artists[0].name },
        label: data.label,
        tracks: _cleanAlbumTracksData(data.tracks.items, data.images),
        isAlbum: true
    }
}

function _cleanAlbumTracksData(data, imgUrls) {
    return data.map(track => {
        return {
            id: track.id,
            title: track.name,
            artists: _cleanArtists(track.artists),
            artistId: track.artists[0].id,
            formalDuration: track.duration_ms,
            youtubeId: '',
            imgUrl: imgUrls
        }
    })
}

function _cleanCategoryStationsData(data) {
    return data.playlists.items.map(item => ({
        spotifyId: item.id ? item.id : '0',
        name: item.name,
        imgUrl: item.images[0].url,
        description: item.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '')
    }))
}

function _cleanStationTracksData(data) {
    return data.items.map(item => {
        return {
            addedAt: item.added_at,
            id: item.track.id,
            title: item.track.name,
            artists: _cleanArtists(item.track.artists),
            artistId: item.track.artists[0].id,
            imgUrl: item.track.album.images,
            formalDuration: item.track.duration_ms,
            album: item.track.album.name,
            youtubeId: ''
        }
    })
}

async function _cleanSearchData(data) {
    const tracks = data.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        artists: _cleanArtists(track.artists),
        artistId: track.artists[0].id,
        imgUrl: track.album.images,
        formalDuration: track.duration_ms,
        album: track.album.name,
        youtubeId: ''
    }))

    const stations = data.playlists.items.map(station => ({
        spotifyId: station.id,
        name: station.name,
        imgUrl: station.images[0].url,
        description: station.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '')
    }))

    const albums = data.albums.items.map(album => ({
        spotifyId: album.id,
        name: album.name,
        artists: _cleanArtists(album.artists),
        imgUrl: album.images[0].url,
        releaseDate: album.release_date,
        isAlbum: true
    }))

    return { tracks, stations, albums }
}

async function _cleanArtistData(data) {
    return {
        spotifyId: data.id,
        name: data.name,
        imgUrl: data.images[0].url,
        followers: data.followers.total
    }
}

function _cleanArtists(artists) {
    return artists.map((artist) => artist.name)
}


async function getStationsForHome() {
    const categories = [
        { id: 'toplists', name: 'Top Lists' },
        { id: 'featured', name: 'Featured Playlists' },
        { id: '0JQ5DAqbMKFLVaM30PMBm4', name: 'Summer' },
        { id: '0JQ5DAqbMKFAXlCG6QvYQ4', name: 'Workout' },
        { id: '0JQ5DAqbMKFzHmL4tf05da', name: 'Mood' },
        { id: '0JQ5DAqbMKFQIL0AXnG5AK', name: 'Trending' },
        { id: '0JQ5DAqbMKFAQy4HL4XU2D', name: 'Travel' },
        { id: '0JQ5DAqbMKFRKBHIxJ5hMm', name: 'Tastemakers' },
        { id: '0JQ5DAqbMKFIVNxQgRNSg0', name: 'Decades' },
        { id: '0JQ5DAqbMKFEC4WFtoNRpw', name: 'Pop' },
        { id: '0JQ5DAqbMKFPrEiAOxgac3', name: 'Classical' },
        { id: '0JQ5DAqbMKFCfObibaOZbv', name: 'Gaming' },
    ]

    const results = []

    try {
        for (const category of categories) {
            let stations
            if (category.id === 'featured') {
                const featured = await getSpotifyItems({ type: 'featured' })
                stations = featured.map((item) => ({ ...item, category: category.name, categoryId: category.id }))
            } else {
                stations = await getSpotifyItems({ type: 'categoryStations', id: category.id })
                stations = stations.map((station) => ({ ...station, category: category.name, categoryId: category.id }))
            }
            results.push(stations)
        }

        const filteredResults = results.filter(stationsArray => stationsArray.length > 8)
        _cleanDescriptions(filteredResults)
        return filteredResults
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`)
        throw new Error('Failed to fetch station data')
    }
}

// cleans descriptions from <a> tags
function _cleanDescriptions(arr) {
    arr.forEach(item => {
        if (Array.isArray(item)) _cleanDescriptions(item)
        else if (typeof item === 'object') item.description = item.description.replace(/<a\b[^>]*>.*?<\/a>/gi, '')
    })
}