import Joi from 'joi'

const username = Joi.string().min(1).required()
const message = Joi.string().required()

// Message
export const chatroomValidation = Joi.object().keys({
    username,
    message
})