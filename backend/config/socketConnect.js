import tripModel from '../models/tripModel.js'

export default function socketConnect(io) {
    io.on('connection', (socket) => {
        console.log('user connected', socket.id)
        socket.on('join', async (data) => {
            const { user, roomId } = data
            const trip = await tripModel.findById(roomId)
            if (trip.tripMates.includes(user._id)) {
                socket.join(roomId)
                socket.broadcast.to(data.roomId).emit('user joined')
                console.log(`${user.username} joined room ${roomId}`)
            }
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

        socket.on('joinNotifications', (data) => {
            socket.join(data.user._id)
            console.log(data.user.email, 'joined notif')
        })

        socket.on('notification', (data) => {
            io.to(data.receiverId).emit('new notification', data.notification)
            console.log('notificaion', data)
        })

        socket.on('leaveNotifications', (data) => {
            socket.leave(data.user._id)
            console.log(data.user.email, 'left notif')
        })

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id)
        })
    })
}
