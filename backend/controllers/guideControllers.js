import axios from 'axios'
// import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import guideModel from '../models/guideModel.js'
// import userModel from '../models/userModel.js'

//-----------------------------------------------//

export async function createNewGuide(req, res) {
    try {
        const frontendData = req.body
        const accessKey = process.env.UNSPLASH_KEY
        const trimmedQuery = frontendData?.place?.name?.trim()

        const fetchPhotoUrlResponse = await axios.get(
            `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${trimmedQuery}`
        )
        const photoUrl = fetchPhotoUrlResponse?.data?.results[0]?.urls?.regular

        // Construct the new trip data
        const newGuideData = {
            writer: req.user.id,
            name: `${frontendData.place.name} Guide`,
            place: {
                name: frontendData.place.name,
                extendedName: frontendData.place.extendedName,
                coordinates: frontendData.place.coordinates,
            },
            writersRelation: '',
            generalTips: '',
            sections: [
                {
                    name: 'Places to visit',
                    note: '',
                },
            ],
            likes: [],
        }
        if (photoUrl?.length > 3) {
            newGuideData.coverPhoto = photoUrl
        }

        // Create the new trip
        const newGuide = new guideModel(newGuideData)
        const savedGuide = await newGuide.save()
        const guide = await guideModel
            .findById(savedGuide._id)
            .populate({
                path: 'writer',
                select: '_id username name profilePic',
            })
            .exec()

        res.status(201).json({
            message: 'New guide created',
            guide: guide,
        })
    } catch (error) {
        console.error('Error creating new guide:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getEditGuideDetails(req, res) {
    try {
        const guideId = req.params.guideId
        const guide = await guideModel
            .findById(guideId)
            .populate('writer', '_id username name profilePic')
            .exec()
        return res.status(200).json({ message: 'Success', guide: guide })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
