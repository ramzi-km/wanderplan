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
        const detailsToUpdate = {
            username: req.body.username,
            name: req.body.name,
            mobile: req.body.mobile,
        }
        if (
            !detailsToUpdate.username ||
            !detailsToUpdate.name ||
            !detailsToUpdate.mobile
        ) {
            return res
                .status(401)
                .json({ message: 'provide necessary information' })
        }
        const username = detailsToUpdate.username
        const findUser = await userModel.findOne({ username })
        if (findUser && findUser.id !== user.id) {
            return res.status(403).json({ message: 'username already taken' })
        } else {
            user = await userModel
                .findByIdAndUpdate(
                    user.id,
                    { $set: detailsToUpdate },
                    {
                        new: true,
                    }
                )
                .select('-password')

            res.status(200).json({ user: user, message: 'success' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'internal server error' })
    }
}
