import 'dotenv/config.js'

const port: string = process.env.PORT ?? '5300'
const mongoUri: string = process.env.MONGO_URI ?? 'mongodb+srv://liminil:LiminilL1%21%23@cluster0.rmmwg.mongodb.net/?retryWrites=true&w=majority'
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