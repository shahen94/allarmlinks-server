import Joi from "joi";

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
