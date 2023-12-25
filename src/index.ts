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

const currentPlayers: any = {};
const currentGames: any = {};
let playerCount = 0


io.on('start-game', (socket: Socket) => {
    console.log(`[server]: ${socket.id} started a game`)
    currentGames[`game_${socket.id}`] = {
        gameId: `game_${socket.id}`,
        player1: currentPlayers[socket.id].id,
        player2: 'ai',
        result: null
    }
});


io.on('connection', (socket: Socket) => {
    console.log(`[server]: ${socket.id} connected`)

    if(!currentPlayers[socket.id]){
        currentPlayers[socket.id] = {
            playerId: socket.id,
            playerNumber: (playerCount % 2) + 1,
            nickname: null
        }
        playerCount++
        socket.emit('current-count', playerCount)
    }
    socket.on('disconnect', () => {
        console.log(`[server]: ${currentPlayers[socket.id].nick} disconnected`)
        delete currentPlayers[socket.id]
        playerCount--
        io.emit('current-count', playerCount)
    })
    socket.on('register', (data: any) => {
        console.log(`[server]: ${data} registered to play`)
        currentPlayers[socket.id].nickname = data
    });
    socket.on('make-move', (move: string) => {
        console.log(`[server]: ${socket.id} made a move: ${move}`)
        let aiMove = makeAIMove()
        socket.emit('move-made', checkWinner(move, aiMove), aiMove)
    })


})

const makeAIMove = () => {
    let aiMove = Math.floor(Math.random() * 3) + 1;
    return aiMove === 1 ? 'rock' : aiMove === 2 ? 'paper' : 'scissors';
}
const checkWinner = (player1: string, player2: string) => {
    if (player1 === player2) {
        return 'tie';
    }

    const winMap: any = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    };

    return winMap[player1] === player2 ? 'player1' : 'AI';
}
httpServer.listen(port, (): void => {
    console.log(`[server]: server running at port ${port}`)
})