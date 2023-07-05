const mongoose = require('mongoose')
const USER_NAME = process.env.USER_NAME
const USER_PASSWORD = encodeURIComponent(process.env.USER_PASSWORD)


const connectDB = async (server) => {
    try {
        const conn = await mongoose.connect(
            `mongodb+srv://${USER_NAME}:${USER_PASSWORD}@todreamscluster.wt1ri7l.mongodb.net/app?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )

        console.log(`Database MongoDB running on: ${conn.connection.host}`.grey)
        server()

    } catch (error) {
        console.log(`${error}`.red)
        process.exit(1)
    }
}



module.exports = connectDB;