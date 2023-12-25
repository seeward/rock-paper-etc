"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatroomValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const username = joi_1.default.string().min(1).required();
const message = joi_1.default.string().required();
exports.chatroomValidation = joi_1.default.object().keys({
    username,
    message
});
