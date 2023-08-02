import {dbService} from '../../services/db.service.js'
import {logger} from '../../services/logger.service.js'
import {utilService} from '../../services/util.service.js'
import mongodb from 'mongodb'
const {ObjectId} = mongodb

const PAGE_SIZE = 3


async function query(filterBy = { txt:'' }) {
    try {

        const criteria = {
            // vendor: { $regex: filterBy.txt, $options: 'i' }
        }

        const collection = await dbService.getCollection('station')
        var stationCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            stationCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const stations = stationCursor.toArray()

        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        const station = await collection.findOne({ _id: stationId })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ _id: stationId })
        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.insertOne(station)
        return station
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function update(station) {
    try {
        const stationToSave = {
            name: station.name,
            description: station.description,
            tracks: station.tracks,
        }
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: station._id }, { $set: stationToSave })
        return station
    } catch (err) {
        logger.error(`cannot update station ${station._id}`, err)
        throw err
    }
}

async function addStationMsg(stationId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(stationId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

async function removeStationMsg(stationId, msgId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(stationId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

export const stationService = {
    remove,
    query,
    getById,
    add,
    update,
    addStationMsg,
    removeStationMsg
}
