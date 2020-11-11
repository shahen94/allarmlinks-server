const Joi = require("joi");

export const loginValidationSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});

export const addAdminSchema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string()
        .required()
        .min(8)
        .regex(/(?=.*[A-Z])(?=.*\d)/),
});

export const workStatusSchema = Joi.object({
    workStatus: Joi.string().min(1).required(),
})

export const noteSchema = Joi.object({
    note: Joi.string().min(1).required(),
})
