import mongoose from 'mongoose'

function connectDb() {
    mongoose.set('strictQuery', true)
    mongoose
        .connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('mongo db connection established')
        })
        .catch((err) => {
            console.log('mongo db connection error: ' + err)
            process.exit(1)
        })
}
export default connectDb
