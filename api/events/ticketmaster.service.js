import axios from 'axios'

export const ticketmasterService = {
    getEventsAndSocials
}

export async function getEventsAndSocials(term) {

    try {
        const { artistId, socials } = await _getArtistId(term)

        const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${artistId}&apikey=${process.env.TICKETMASTER}&sort=date,asc`
        const res = await axios.get(url)
        const data = res.data._embedded.events

        const events = data.map(event => {
            const { month, day, weekday } = _formatDate(event.dates.start.localDate)

            return {
                id: event.id,
                artist: term,
                day,
                month,
                weekday,
                time: _formatTime(event.dates.start.localTime),
                name: event.name,
                url: event.url,
                city: event._embedded.venues[0].city.name,
                venue: event._embedded.venues[0].name
            }
        })

        return {
            events,
            socials
        }
    }

    catch (error) {
        console.error(error)
    }
}

function _formatDate(date) {
    const dateObj = new Date(date)
    const month = dateObj.toLocaleString('default', { month: 'short' })
    const day = dateObj.getDate()
    const weekday = dateObj.toLocaleString('default', { weekday: 'short' })
    return { month, day, weekday }
}

function _formatTime(time) {
    const timeObj = new Date('2000-01-01T' + time)
    const formattedTime = timeObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return formattedTime !== 'Invalid Date' ? formattedTime : null
}


async function _getArtistId(term) {
    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${term}&apikey=${process.env.TICKETMASTER}`;
    try {
        const response = await axios.get(url)
        const artistId = response.data._embedded.attractions[0].id
        const socials = response.data._embedded.attractions[0].externalLinks
        return { artistId, socials }
    }
    catch (error) {
        console.error(error)
    }
}