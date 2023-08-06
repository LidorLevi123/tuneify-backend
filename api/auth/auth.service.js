import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import {userService} from '../user/user.service.js'
import {logger} from '../../services/logger.service.js'
import { stationService } from '../station/station.service.js'

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

async function signup({username, password, fullname, imgUrl }) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('Missing required signup information')

    const userExist = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)

    const user = await userService.add({ username, password: hash, fullname, imgUrl, stationIds: [] })
    const likedStation = await _createLikedSongs({fullname, _id: user._id, imgUrl })
    return await userService.update({ ...user, likedId: likedStation._id.toString()})
}

function getLoginToken(user) {
    const userInfo = {_id: user._id, fullname: user.fullname, isAdmin: user.isAdmin}
    return cryptr.encrypt(JSON.stringify(userInfo))    
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch(err) {
        console.log('Invalid login token')
    }
    return null
}

async function _createLikedSongs(owner) {
    const likedSongs = {
        name: 'Liked Songs',
        description: '',
        imgUrl: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png',
        owner,
        tracks: []
    }
    return await stationService.add(likedSongs)
}

// ;(async ()=>{
//     await signup('bubu', '123', 'Bubu Bi')
//     await signup('mumu', '123', 'Mumu Maha')
// })()