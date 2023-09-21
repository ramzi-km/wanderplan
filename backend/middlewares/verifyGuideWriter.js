import guideModel from '../models/guideModel.js'

export default async function verifyGuideWriter(req, res, next) {
    try {
        const user = req.user
        const guideId = req.params.guideId
        const guide = await guideModel.findById(guideId)
        if (!guide) {
            return res.status(422).json({ message: 'guide not found' })
        }
        if (guide?.writer.toString() !== user.id) {
            return res.status(422).json({ message: 'Access to edit denied' })
        }
        req.user = user
        req.guide = guide
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.' })
    }
}
