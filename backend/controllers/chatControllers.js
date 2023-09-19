//------------------ models --------------------//

import messageModel from '../models/messageModel.js'

//-----------------------------------------------//

export async function createMessage(req, res) {
    try {
        const roomId = req.params.id
        const { messageText, sender, time } = req.body

        // Create a new message document
        const newMessage = new messageModel({
            messageText,
            sender,
            roomId,
            time,
        })

        await newMessage.save()

        return res
            .status(201)
            .json({ newMessage, message: 'successfully stored trip message' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getAllMessagesForRoom(req, res) {
    try {
        const roomId = req.params.id

        const messages = await messageModel.find({ roomId }).sort('time')

        return res.status(200).json({ messages, message: 'success' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
