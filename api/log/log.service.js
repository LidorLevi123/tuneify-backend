import fs from 'fs'

export const logService = {
    getBackendLog
}

function getBackendLog() {

    const log = fs.readFileSync('./logs/backend.log', 'utf8')
    const logEntries = log.split('\n').filter(entry => entry.trim() !== '')

    const logObjects = logEntries.map(entry => {
        const [time, ...messageParts] = entry.split(' - ')
        const msg = messageParts.join(' - ')

        return { time, msg }
    })

    return logObjects
}