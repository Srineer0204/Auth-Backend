const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.min":"Name must be at least 3 characters",
        "any.required": "Name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Enter a valid email",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be atleast 6 characters",
        "any.required": "Password is required"
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email":"Enter a valid email",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required"
    })
});

module.exports = {
    registerSchema,
    loginSchema
}