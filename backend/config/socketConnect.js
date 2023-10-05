import tripModel from '../models/tripModel.js'

export default function socketConnect(io) {
    io.on('connection', (socket) => {
        socket.on('join', async (data) => {
            const { user, roomId } = data
            const trip = await tripModel.findById(roomId)
            if (trip.tripMates.includes(user._id)) {
                socket.join(roomId)
                socket.broadcast.to(data.roomId).emit('user joined')
                console.log(`${user.username} joined room ${roomId}`)
            }
        })
        socket.on('joinNotifications',()=>{
            
        })
        socket.on('leave', (data) => {
            const { user, roomId } = data
            socket.leave(roomId)
            console.log(`${user.username} left room ${roomId}`)
        })

        socket.on('message', (data) => {
            const { roomId, messageData } = data
            io.to(roomId).emit('new message', messageData)

            console.log(`Message sent to room ${roomId}: ${messageData}`)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}
