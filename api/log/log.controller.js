import { logService } from './log.service.js'

export function getBackendLog(req, res) {
    const log = logService.getBackendLog()
    res.json(log)
}