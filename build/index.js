"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = require("rotating-file-stream");
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const websocket_1 = require("./helper/websocket");
const cors_1 = __importDefault(require("cors"));
const chatroom_route_1 = require("./routes/chatroom.route");
const port = (_a = config_1.default.port) !== null && _a !== void 0 ? _a : 5000;
const accessLogStream = (0, rotating_file_stream_1.createStream)(`access.log`, {
    interval: '1d',
    path: path_1.default.join(__dirname, 'log')
});
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = (0, websocket_1.initializeWebSocket)(httpServer);
(0, mongoose_1.connect)(config_1.default.mongoUri)
    .then(() => {
    console.log('[server]: successfully connected to mongodb');
})
    .catch(error => {
    console.error('[server]: failed-connecting-to-mongo-database', error);
});
app.use((0, morgan_1.default)('combined', {
    stream: accessLogStream
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: true
}));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api/v1/user/chat', chatroom_route_1.router);
app.get('/ping', (req, res) => {
    console.log(`[server]: ${req.headers.host} pinging the server`);
    res.status(200).send({
        success: true,
        status: 200,
        data: {
            message: 'valenoirs',
        }
    });
});
app.use('/', (req, res) => {
    res.status(404).send({
        error: true,
        status: 404,
        type: 'NotFound',
        data: {
            message: 'No API endpoint found.'
        }
    });
});
const currentPlayers = {};
const currentGames = {};
let playerCount = 0;
io.on('start-game', (socket) => {
    console.log(`[server]: ${socket.id} started a game`);
    currentGames[`game_${socket.id}`] = {
        gameId: `game_${socket.id}`,
        player1: currentPlayers[socket.id].id,
        player2: 'ai',
        result: null
    };
});
io.on('connection', (socket) => {
    console.log(`[server]: ${socket.id} connected`);
    if (!currentPlayers[socket.id]) {
        currentPlayers[socket.id] = {
            playerId: socket.id,
            playerNumber: (playerCount % 2) + 1,
            nickname: null
        };
        playerCount++;
        socket.emit('current-count', playerCount);
    }
    socket.on('disconnect', () => {
        console.log(`[server]: ${currentPlayers[socket.id].nick} disconnected`);
        delete currentPlayers[socket.id];
        playerCount--;
        io.emit('current-count', playerCount);
    });
    socket.on('register', (data) => {
        console.log(`[server]: ${data} registered to play`);
        currentPlayers[socket.id].nickname = data;
    });
    socket.on('make-move', (move) => {
        console.log(`[server]: ${socket.id} made a move: ${move}`);
        let aiMove = makeAIMove();
        socket.emit('move-made', checkWinner(move, aiMove), aiMove);
    });
});
const makeAIMove = () => {
    let aiMove = Math.floor(Math.random() * 3) + 1;
    return aiMove === 1 ? 'rock' : aiMove === 2 ? 'paper' : 'scissors';
};
const checkWinner = (player1, player2) => {
    if (player1 === player2) {
        return 'tie';
    }
    const winMap = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    };
    return winMap[player1] === player2 ? 'player1' : 'AI';
};
httpServer.listen(port, () => {
    console.log(`[server]: server running at port ${port}`);
});
