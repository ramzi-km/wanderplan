import axios from 'axios'
import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import guideModel from '../models/guideModel.js'
import userModel from '../models/userModel.js'

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
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getViewGuideDetails(req, res) {
    try {
        const guideId = req.params.guideId
        const guide = await guideModel
            .findOne({ _id: guideId, unList: false })
            .populate('writer', '_id username name profilePic')
            .exec()
        if (!guide) {
            return res.status(400).json({ message: 'Invalid guide id' })
        }
        return res.status(200).json({ message: 'Success', guide: guide })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function likeGuide(req, res) {
    try {
        const guideId = req.params.guideId
        const userId = req.user._id

        const [likedUser, guide] = await Promise.all([
            userModel.findById(userId),
            guideModel.findById(guideId).populate('writer'),
        ])

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' })
        }

        if (guide.likes.includes(userId)) {
            return res
                .status(400)
                .json({ message: 'You have already liked this guide' })
        }

        guide.likes.push(userId)

        guide.likesCount++

        const savedguide = await guide.save()
        const guideWriter = savedguide.writer
        console.log(likedUser._id, guideWriter._id)

        if (likedUser._id.toString() == guideWriter._id.toString()) {
            return res.status(200).json({
                message: 'Guide liked successfully',
                likesCount: guide.likesCount,
                likes: guide.likes,
            })
        }
        const notification = {
            type: 'guideLike',
            content: `${likedUser.username} liked your guide "${guide.name}".`,
            sender: likedUser._id,
            timestamp: new Date(),
        }
        guideWriter.notifications.unshift(notification)
        guideWriter.save()

        const writer = await userModel
            .findOne({ _id: guideWriter._id })
            .populate({
                path: 'notifications',
                populate: [
                    {
                        path: 'sender',
                        model: 'User',
                        select: 'name profilePic username _id',
                    },
                ],
            })
        const savedNotification = writer.notifications.shift()

        res.status(200).json({
            message: 'Guide liked successfully',
            likesCount: guide.likesCount,
            likes: guide.likes,
            notification: savedNotification,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function unlikeGuide(req, res) {
    try {
        const guideId = req.params.guideId
        const userId = req.user._id

        const guide = await guideModel.findById(guideId)

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' })
        }

        if (!guide.likes.includes(userId)) {
            return res
                .status(400)
                .json({ message: 'You have not liked this guide' })
        }

        guide.likes = guide.likes.filter(
            (likedUserId) => likedUserId.toString() !== userId.toString()
        )

        guide.likesCount--

        await guide.save()

        res.status(200).json({
            message: 'Guide unliked successfully',
            likesCount: guide.likesCount,
            likes: guide.likes,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function deleteGuide(req, res) {
    try {
        const guideId = req.guide.id
        await guideModel.findByIdAndRemove(guideId)
        res.status(200).json({ message: 'Trip deleted successfully' })
    } catch (error) {
        console.error('Error deleting trip:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function changeGuideCoverPhoto(req, res) {
    try {
        const guide = req.guide
        const image = req.body.coverPhoto
        if (!image) {
            res.status(422).json({ message: 'provide necessary information' })
        }
        const previousCoverPhoto = guide.coverPhoto
        const coverPhoto = await cloudinary.uploader.upload(image, {
            folder: 'wanderplan',
        })
        const updateGuide = await guideModel.findByIdAndUpdate(
            guide.id,
            { $set: { coverPhoto: coverPhoto.secure_url } },
            {
                new: true,
            }
        )

        const defaultCoverPhotoUrl =
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg'

        if (previousCoverPhoto && previousCoverPhoto !== defaultCoverPhotoUrl) {
            const publicId = previousCoverPhoto.split('/').pop().split('.')[0]
            cloudinary.api
                .delete_resources([`wanderplan/${publicId}`], {
                    type: 'upload',
                    resource_type: 'image',
                })
                .then((data) => console.log(data))
        }
        return res
            .status(200)
            .json({ message: 'Success', coverPhoto: updateGuide.coverPhoto })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function changeGuideName(req, res) {
    try {
        const guideId = req.params.guideId
        const name = req.body.guideName
        if (!name) {
            res.status(422).json({ message: 'provide necessary information' })
        }
        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            { name: name },
            { new: true }
        )
        return res
            .status(200)
            .json({ message: 'success', guideName: guide.name })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateGeneralTips(req, res) {
    try {
        const guideId = req.params.guideId
        const generalTips = req.body.generalTips || ''
        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            { $set: { generalTips: generalTips } },
            { new: true }
        )
        return res.status(200).json({
            message: 'success',
            generalTips: guide.generalTips,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateWritersRelation(req, res) {
    try {
        const guideId = req.params.guideId
        const writersRelation = req.body.writersRelation || ''
        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            { $set: { writersRelation: writersRelation } },
            { new: true }
        )
        return res.status(200).json({
            message: 'success',
            writersRelation: guide.writersRelation,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function addSection(req, res) {
    try {
        const guideId = req.params.guideId

        const newSection = {
            name: '',
            note: '',
            places: [],
        }

        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            { $push: { sections: newSection } },
            { new: true }
        )
        const section = guide.sections.pop()

        return res.status(200).json({
            message: 'success',
            section: section,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function deleteSection(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId

        // eslint-disable-next-line no-unused-vars
        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            { $pull: { sections: { _id: sectionId } } },
            { new: true }
        )

        return res.status(200).json({
            message: 'success',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateSectionNote(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId

        const newNote = req.body.note

        const guide = await guideModel.findById(guideId)

        if (!guide) {
            return res.status(400).json({
                message: 'Guide not found',
            })
        }

        const sectionToUpdate = guide.sections.find(
            (section) => section._id.toString() === sectionId
        )

        if (!sectionToUpdate) {
            return res.status(400).json({
                message: 'Section not found in the guide',
            })
        }

        sectionToUpdate.note = newNote
        await guide.save()

        return res.status(200).json({
            note: sectionToUpdate.note,
            message: 'success',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateSectionName(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId
        const newSectionName = req.body.name ?? ''

        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            {
                $set: {
                    'sections.$[section].name': newSectionName,
                },
            },
            {
                new: true,
                arrayFilters: [{ 'section._id': sectionId }],
            }
        )
        let name = ''
        guide.sections.forEach((section) => {
            if (section._id.toString() === sectionId) {
                name = section.name
            }
        })
        return res.status(200).json({
            message: 'Section name updated successfully',
            name: name,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function addPlaceToSection(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId
        let place = req.body.place
        if (!place?.name || !place.coordinates) {
            res.status(422).json({ message: 'provide necessary information' })
        }

        const accessKey = process.env.UNSPLASH_KEY
        const trimmedQuery = place?.name?.trim()

        const fetchPhotoUrlResponse = await axios.get(
            `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${trimmedQuery}`
        )

        const photoUrl = fetchPhotoUrlResponse.data?.results[0]?.urls?.regular
        if (photoUrl) {
            place.image = photoUrl
        }

        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            {
                $push: {
                    'sections.$[section].places': place,
                },
            },
            {
                new: true,
                arrayFilters: [{ 'section._id': sectionId }],
            }
        )

        guide.sections.forEach((section) => {
            if (section._id.toString() == sectionId) {
                place = section.places.pop()
            }
        })

        return res.status(200).json({
            message: 'success',
            place: place,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateSectionPlaceDescription(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId
        const placeId = req.params.placeId
        const newDescription = req.body.description ?? ''

        const guide = await guideModel.findOneAndUpdate(
            {
                _id: guideId,
                'sections._id': sectionId,
                'sections.places._id': placeId,
            },
            {
                $set: {
                    'sections.$[s].places.$[p].description': newDescription,
                },
            },
            {
                new: true,
                arrayFilters: [{ 's._id': sectionId }, { 'p._id': placeId }],
            }
        )

        if (!guide) {
            return res
                .status(400)
                .json({ message: 'Guide, section, or place not found' })
        }

        const updatedPlace = guide.sections
            .find((section) => section._id.toString() === sectionId)
            .places.find((place) => place._id.toString() === placeId)

        return res.status(200).json({
            message: 'Place description updated successfully',
            place: updatedPlace,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateSectionPlacePhoto(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId
        const placeId = req.params.placeId
        const newPhoto = req.body.image
        console.log(newPhoto)

        if (!newPhoto) {
            return res.status(400).json({ message: 'provide image' })
        }

        const image = await cloudinary.uploader.upload(newPhoto, {
            folder: 'wanderplan',
        })

        const guide = await guideModel.findOneAndUpdate(
            {
                _id: guideId,
                'sections._id': sectionId,
                'sections.places._id': placeId,
            },
            {
                $set: {
                    'sections.$[s].places.$[p].image': image.secure_url,
                },
            },
            {
                new: true,
                arrayFilters: [{ 's._id': sectionId }, { 'p._id': placeId }],
            }
        )

        if (!guide) {
            return res
                .status(404)
                .json({ message: 'Guide, section, or place not found' })
        }

        const updatedPlace = guide.sections
            .find((section) => section._id.toString() === sectionId)
            .places.find((place) => place._id.toString() === placeId)

        return res.status(200).json({
            message: 'Place photo updated successfully',
            place: updatedPlace,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function deleteSectionPlace(req, res) {
    try {
        const guideId = req.params.guideId
        const sectionId = req.params.sectionId
        const placeId = req.params.placeId

        const guide = await guideModel.findByIdAndUpdate(
            guideId,
            {
                $pull: {
                    'sections.$[s].places': { _id: placeId },
                },
            },
            {
                new: true,
                arrayFilters: [{ 's._id': sectionId }],
            }
        )

        if (!guide) {
            return res
                .status(404)
                .json({ message: 'Guide or section not found' })
        }

        return res.status(200).json({
            message: 'Place deleted successfully',
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
