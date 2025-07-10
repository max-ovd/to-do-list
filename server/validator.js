import Joi from 'joi';

const validator = (schema) => (payload) => 
    schema.validate(payload, { abordEarly: false })

const addItemSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    checked: Joi.bool().required(),
    parent: Joi.string().required(),
    _id: Joi.string().optional()
})


const addListSchema = Joi.object({
    title: Joi.string().required()
})

export const validateAddItem = validator(addItemSchema);
export const validateAddList = validator(addListSchema);