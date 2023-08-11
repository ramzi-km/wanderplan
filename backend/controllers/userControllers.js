import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import userModel from '../models/userModel.js'

//-----------------------------------------------//

export async function getUser(req, res) {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
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
        res.status(500).json({ error: error, message: 'Internal Server Error' })
    }
}

export async function uploadProfile(req, res) {
    try {
        const user = req.user
        const image = req.body.profilePic
        if (image == undefined) {
            return res.json({ message: 'provide necessary information' })
        }
        const previousProfilePic = user.profilePic
        const profilePic = await cloudinary.uploader.upload(image, {
            folder: 'wanderplan',
        })
        const updatedUser = await userModel
            .findByIdAndUpdate(
                user.id,
                { $set: { profilePic: profilePic.secure_url } },
                {
                    new: true,
                }
            )
            .select('-password')

        // Default profile picture URL
        const defaultProfilePicUrl =
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1691666473/wanderplan/j7nkqvajk2ppfdfqqpkt.png'

        // Delete the previous profile picture from Cloudinary if it's not the default one
        if (previousProfilePic && previousProfilePic !== defaultProfilePicUrl) {
            const publicId = previousProfilePic.split('/').pop().split('.')[0]
            cloudinary.api
                .delete_resources([`wanderplan/${publicId}`], {
                    type: 'upload',
                    resource_type: 'image',
                })
                .then((data) => console.log(data))
        }

        res.status(200).json({ user: updatedUser, message: 'success' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
