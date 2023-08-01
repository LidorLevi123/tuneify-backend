
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'



export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    addStationMsg
}
window.cs = stationService


async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get('station', filterBy)
}
function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}
async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)

    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const savedMsg = await httpService.post(`station/${stationId}/msg`, {txt})
    return savedMsg
}


function getEmptyStation() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}





