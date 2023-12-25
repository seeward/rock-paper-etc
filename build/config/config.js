"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config.js");
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '5300';
const mongoUri = (_b = process.env.MONGO_URI) !== null && _b !== void 0 ? _b : 'mongodb+srv://liminil:LiminilL1%21%23@cluster0.rmmwg.mongodb.net/?retryWrites=true&w=majority';
const cors = {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
};
const config = {
    port,
    mongoUri,
    cors
};
exports.default = config;
