"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatroom = void 0;
const mongoose_1 = require("mongoose");
const ChatroomSchema = new mongoose_1.Schema({
    username: { type: String, required: true, default: 'Anonymous' },
    message: { type: String, required: true, default: '*Empty message' },
    admin: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});
exports.Chatroom = (0, mongoose_1.model)('Chatroom', ChatroomSchema);
