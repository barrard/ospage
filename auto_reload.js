const watch = require('node-watch')
const join = require('path').join

// Directory to watch for changes.
const directory = join(__dirname, 'www')

// Emit event recursively.
const options = { recursive: true }

// Event to emit if a something changes.
const event = 'auto_reload'

// Publish AutoReload function.
module.exports = (socket) => watch(directory, options, () => socket.emit(event))
