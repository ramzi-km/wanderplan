import userModel from '../models/userModel.js'

export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}, { password: 0, __v: 0 })
        res.status(200).json({ users: users, message: 'ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'Internal server error' })
    }
}

export async function blockUser(req, res) {
    try {
        const userId = req.params.id
        const user = await userModel.findById(userId)
        if (userId) {
            user.ban = !user.ban
            await user.save()
            res.status(200).json({ message: 'Success', userId: user.id })
        } else {
            res.status(401).json({
                message: 'user with the provided id does not exist',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'Internal server error' })
    }
}
