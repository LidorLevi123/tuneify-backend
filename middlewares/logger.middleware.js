import {logger} from '../services/logger.service.js'

export async function log(req, res, next) {
  logger.info('Sample Logger Middleware')
  next()
}

