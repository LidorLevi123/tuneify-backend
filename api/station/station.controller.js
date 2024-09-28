import { stationService } from './station.service.js'
import { logger } from '../../services/logger.service.js'
import { spotifyService } from '../spotify/spotify.service.js'

export async function getStations(req, res) {
  try {
    logger.debug('Getting Stations:', req.query)

    const stations = await stationService.query(req.query.userId)
    res.json(stations)
  } catch (err) {
    logger.error('Failed to get stations', err)
    res.status(400).send({ err: 'Failed to get stations' })
  }
}

export async function getStationById(req, res) {
  try {
    const stationId = req.params.id
    let station = await stationService.getById(stationId)
    // Check if the request is coming from a crawler (like WhatsApp) or a typical API client
    const isCrawler =
      (req.headers['user-agent'] &&
        req.headers['user-agent'].includes('WhatsApp')) ||
      req.query.preview === 'true' // Optionally detect preview mode using a query param

    if (isCrawler) {
      if (!station) { 
        station = await spotifyService.getSpotifyItems({ type: 'album', id: stationId })
      }

      const htmlContent = _getOpenGraphMetaTags(station)
      res.setHeader('Content-Type', 'text/html')
      res.send(htmlContent)

    } else res.json(station)
  } catch (err) {
    logger.error('Failed to get station', err)
    res.status(500).send({ err: 'Failed to get station' })
  }
}

function _getOpenGraphMetaTags(station) {
  const { name, artists, releaseDate, tracks } = station
  const artistsStr = artists.map(a => a.name).join(', ')
  const releaseYear = releaseDate.split('-')[0]
  const image = tracks[0].imgUrl[1].url
  
  return `
        <meta property="og:title" content="${name}" />
        <meta property="og:description" content="Song • ${artistsStr} • ${releaseYear}" />
        <meta property="og:image" content="${image}" />
      `
}

export async function addStation(req, res) {
  const { loggedinUser } = req

  try {
    const station = req.body
    if (station.isEmpty) station.owner = loggedinUser
    delete station.isEmpty
    const addedStation = await stationService.add(station)
    res.json(addedStation)
  } catch (err) {
    logger.error('Failed to add station', err)
    res.status(400).send({ err: 'Failed to add station' })
  }
}

export async function updateStation(req, res) {
  try {
    const station = req.body
    const updatedStation = await stationService.update(station)
    res.json(updatedStation)
  } catch (err) {
    logger.error('Failed to update station', err)
    res.status(400).send({ err: 'Failed to update station' })
  }
}

export async function removeStation(req, res) {
  try {
    const stationId = req.params.id
    const removedId = await stationService.remove(stationId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove station', err)
    res.status(400).send({ err: 'Failed to remove station' })
  }
}

export async function getAllStations(req, res) {
  try {
    const stations = await stationService.getAllStations()
    res.send(stations)
  } catch (err) {
    logger.error('Failed to get all stations', err)
    res.status(400).send({ err: 'Failed to get all stations' })
  }
}

export async function removeStationsByName(req, res) {
  try {
    const term = req.params.name
    const stationsDeletedNum = await stationService.removeStationsByName(term)
    res.json(stationsDeletedNum)
  } catch (err) {
    logger.error('Failed to delete stations', err)
    res.status(400).send({ err: 'Failed to delete stations' })
  }
}

export async function getTopTen(req, res) {
  try {
    const topTen = await stationService.getTopTen()
    res.json(topTen)
  } catch (err) {
    logger.error('Failed to get top ten stations', err)
    res.status(400).send({ err: 'Failed to get top ten stations' })
  }
}
