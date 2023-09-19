export default function socketConnect(io) {
    io.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('message', (msg) => {
            console.log('message : ' + msg)
            io.emit('message', msg)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}
