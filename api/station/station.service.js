import {dbService} from '../../services/db.service.js'
import {logger} from '../../services/logger.service.js'
import {utilService} from '../../services/util.service.js'
import mongodb from 'mongodb'

const { ObjectId } = mongodb

// const PAGE_SIZE = 3

async function query(userId) {
    try {
        const userCollection = await dbService.getCollection('user')
        const user = await userCollection.findOne({ _id: ObjectId(userId) })
        
        const likedStationId = ObjectId(user.likedId)
        const stationIds = user.stationIds.map(id => ObjectId(id))
        
        const stationCollection = await dbService.getCollection('station')
        const stationCursor = await stationCollection.find({
            _id: { $in: [likedStationId, ...stationIds] }
        })
        
        const stations = await stationCursor.toArray()
        const likedStationIndex = stations.findIndex(station => station._id.equals(likedStationId))
        
        const likedStation = stations.splice(likedStationIndex, 1)[0]
        stations.unshift(likedStation)
        
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        let station
        if(stationId.length < 24) station = await collection.findOne({ spotifyId: stationId })
        else station = await collection.findOne({ _id: ObjectId(stationId) })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ _id: ObjectId(stationId) })
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
            imgUrl: station.imgUrl
        }
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(station._id) }, { $set: stationToSave })
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
