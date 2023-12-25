"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = void 0;
const socket_io_1 = require("socket.io");
const config_1 = __importDefault(require("../config/config"));
let io;
const initializeWebSocket = (httpServer) => {
    if (!io) {
        io = new socket_io_1.Server(httpServer, config_1.default.cors);
    }
    return io;
};
exports.initializeWebSocket = initializeWebSocket;
