import {carService} from './car.service.js'
import {logger} from '../../services/logger.service.js'

export async function getCars(req, res) {
  try {
    logger.debug('Getting Cars:', req.query)
    const filterBy = {
      txt: req.query.txt || '',
      pageIdx: req.query.pageIdx
    }
    const cars = await carService.query(filterBy)
    res.json(cars)
  } catch (err) {
    logger.error('Failed to get cars', err)
    res.status(400).send({ err: 'Failed to get cars' })
  }
}

export async function getCarById(req, res) {
  try {
    const carId = req.params.id
    const car = await carService.getById(carId)
    res.json(car)
  } catch (err) {
    logger.error('Failed to get car', err)
    res.status(400).send({ err: 'Failed to get car' })
  }
}

export async function addCar(req, res) {
  const {loggedinUser} = req

  try {
    const car = req.body
    car.owner = loggedinUser
    const addedCar = await carService.add(car)
    res.json(addedCar)
  } catch (err) {
    logger.error('Failed to add car', err)
    res.status(400).send({ err: 'Failed to add car' })
  }
}


export async function updateCar(req, res) {
  try {
    const car = req.body
    const updatedCar = await carService.update(car)
    res.json(updatedCar)
  } catch (err) {
    logger.error('Failed to update car', err)
    res.status(400).send({ err: 'Failed to update car' })

  }
}

export async function removeCar(req, res) {
  try {
    const carId = req.params.id
    const removedId = await carService.remove(carId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove car', err)
    res.status(400).send({ err: 'Failed to remove car' })
  }
}

export async function addCarMsg(req, res) {
  const {loggedinUser} = req
  try {
    const carId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await carService.addCarMsg(carId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update car', err)
    res.status(400).send({ err: 'Failed to update car' })

  }
}

export async function removeCarMsg(req, res) {
  const {loggedinUser} = req
  try {
    const carId = req.params.id
    const {msgId} = req.params

    const removedId = await carService.removeCarMsg(carId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove car msg', err)
    res.status(400).send({ err: 'Failed to remove car msg' })

  }
}


