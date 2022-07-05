import 'dotenv/config.js'

const port: string = process.env.PORT ?? '5000'
const mongoUri: string = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/database'
const cors = {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
}

const config = {
    port,
    mongoUri,
    cors
}

export default config