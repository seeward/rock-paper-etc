import express from 'express'
import { sendMessage, getAllMessage } from '../controllers/chatroom.controller'

export const router = express.Router()

router.route('/').get(getAllMessage)
router.route('/').post(sendMessage)