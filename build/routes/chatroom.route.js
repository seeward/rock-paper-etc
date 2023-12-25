"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const chatroom_controller_1 = require("../controllers/chatroom.controller");
exports.router = express_1.default.Router();
exports.router.route('/').get(chatroom_controller_1.getAllMessage);
exports.router.route('/').post(chatroom_controller_1.sendMessage);
