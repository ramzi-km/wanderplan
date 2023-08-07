import userModel from '../models/userModel.js'

export async function getUser(req, res) {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function updateUser(req, res) {
    try {
        let user = req.user
        const details = req.body
        user = await userModel
            .findByIdAndUpdate(user.id, details, {
                new: true,
            })
            .select('-password')

        res.status(200).json({ user: user, message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'internal server error' })
    }
}
