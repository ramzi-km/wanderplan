import tripModel from '../models/tripModel.js'

export default function socketConnect(io) {
    io.on('connection', (socket) => {
        socket.on('join', async (data) => {
            const { user, roomId } = data
            const trip = await tripModel.findById(roomId)
            if (trip.tripMates.includes(user._id)) {
                socket.join(roomId)
                console.log(`${user.username} joined room ${roomId}`)
            }
        })
        socket.on('leave', (data) => {
            const { user, roomId } = data
            socket.leave(roomId)
            console.log(`${user.username} left room ${roomId}`)
        })
        
        socket.on('message', (msg) => {
            console.log('message : ' + msg)
            io.emit('message', msg)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}
