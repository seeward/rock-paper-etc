"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessage = exports.sendMessage = void 0;
const websocket_1 = require("../helper/websocket");
const chatroom_validation_1 = require("../helper/chatroom-validation");
const chatroom_model_1 = require("../models/chatroom.model");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield chatroom_validation_1.chatroomValidation.validateAsync(req.body);
        yield new chatroom_model_1.Chatroom(value).save();
        const io = (0, websocket_1.initializeWebSocket)();
        io.of('chat').emit('message', Object.assign(Object.assign({}, value), { createdAt: Date.now() }));
        console.log('[server]: OK! : Message sent!');
        return res.status(200).send({
            success: true,
            status: 200,
            data: {
                message: 'Message sent!'
            }
        });
    }
    catch (error) {
        console.error('[server]: ERR! Sending message error.');
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'SendingMessageError',
            data: {
                message: error
            }
        });
    }
});
exports.sendMessage = sendMessage;
const getAllMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield chatroom_model_1.Chatroom.find();
        console.log('[server]: OK! : Message Fetched!');
        return res.status(200).send({
            success: true,
            status: 200,
            data: {
                message: 'Message fetched!',
                payload: message
            }
        });
    }
    catch (error) {
        console.error('[server]: ERR! Get all message error.');
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'GettingMessageError',
            data: {
                message: error
            }
        });
    }
});
exports.getAllMessage = getAllMessage;
