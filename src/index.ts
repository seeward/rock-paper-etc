import config from './config/config'
import express, {Express, Request, Response} from 'express'
import { connect } from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import { createStream } from 'rotating-file-stream'
import path from 'path'
import { createServer } from 'http'
import { initializeWebSocket } from './helper/websocket'
import { Socket } from 'socket.io'
import cors from 'cors'

// Import Routes
import { router as socketRoute } from './routes/chatroom.route'

// Init
const port = config.port ?? 5000
const accessLogStream = createStream(`access.log`, {
    interval: '1d',
    path: path.join(__dirname, 'log')
})
const app: Express = express()
const httpServer = createServer(app)
const io = initializeWebSocket(httpServer)

// Connecting to MongoDB
connect(config.mongoUri)
.then(() => {
    console.log('[server]: successfully connected to mongodb')
})
.catch(error => {
    console.error('[server]: failed-connecting-to-mongo-database', error)
})

// Middleware
app.use(morgan('combined', {
    stream: accessLogStream
}))
app.use(helmet({
    crossOriginResourcePolicy: true
}))
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Socket Path
io.of('/chat').on('connection', (socket: Socket) => {
    console.log(`[server]: ${socket.id} connected`)
    socket.on('disconnect', () => {
        console.log(`[server]: ${socket.id} disconnected`)
    })
})

// HTTP Routes
app.use('/api/v1/user/chat', socketRoute)

// Ping route
app.get('/ping', (req: Request, res: Response) => {
    console.log(`[server]: ${req.headers.host} pinging the server`)
    res.status(200).send({
        success:true,
        status: 200,
        data: {
            message: 'valenoirs',
        }
    })
})

// 404
app.use('/', (req: Request, res: Response) => {
    res.status(404).send({
        error: true,
        status: 404,
        type: 'NotFound',
        data: {
            message: 'No API endpoint found.'
        }
    })
})

io.on('connection', (socket: Socket) => {
    console.log(`[server]: ${socket.id} connected`)

    socket.on('disconnect', () => {
        console.log(`[server]: ${socket.id} disconnected`)
    })
})

// Server listener
httpServer.listen(port, (): void => {
    console.log(`[server]: server running at port ${port}`)
})