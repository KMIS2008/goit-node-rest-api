const Joi = require('joi');

 const createContactSchema = Joi.object({
    name: Joi.string().required(), 
    email: Joi.string().required(), 
    phone: Joi.string().required(),
    
})

 const updateContactSchema = Joi.object({
    name: Joi.string(), 
    email: Joi.string(), 
    phone: Joi.string(),
    favorite: Joi.boolean(),
    updatedAt: Joi.string()
})

const favoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

module.exports= {updateContactSchema, createContactSchema, favoriteSchema}