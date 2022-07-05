import { Request, Response } from "express";
import { initializeWebSocket } from '../helper/websocket'
import { chatroomValidation } from "../helper/chatroom-validation";
import { IChatroom } from "../interfaces/chatroom.interface";

import { Chatroom } from "../models/chatroom.model";

/**
 * Sending message (Save message to database and send to all client)
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const value: Omit<IChatroom, 'admin'> = await chatroomValidation.validateAsync(req.body)

        await new Chatroom(value).save()

        const io = initializeWebSocket()
        
        io.of('chat').emit('message', value)

        console.log('[server]: OK! : Message sent!')
        return res.status(200).send({
            success: true,
            status: 200,
            data: {
                message: 'Message sent!'
            }
        })
    } catch (error) {
        console.error('[server]: ERR! Sending message error.')
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'SendingMessageError',
            data: {
                message: error
            }
        })
    }
}

/**
 * Get all message from database
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const getAllMessage = async (req: Request, res: Response) => {
    try {
        const message = await Chatroom.find()
        
        console.log('[server]: OK! : Message Fetched!')
        return res.status(200).send({
            success: true,
            status: 200,
            data: {
                message: 'Message fetched!',
                payload: message
            }
        })
    } catch (error) {
        console.error('[server]: ERR! Get all message error.')
        return res.status(500).send({
            error: true,
            status: 500,
            type: 'GettingMessageError',
            data: {
                message: error
            }
        })
    }
}