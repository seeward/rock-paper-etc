import { Server, Socket } from 'socket.io';
import config from '../config/config'

let io: Server;

export const initializeWebSocket = (httpServer?: any) => {
    if(!io){
        io = new Server(httpServer, config.cors)
    }

    return io
}