import mongoose from "mongoose";
import Joi from "joi";


const UserRegistration = new mongoose.Schema({
    firstName:String,
    lastName : String,
    email: String,
    userTypes: String,
    contctNumber: Number,
    verified: Boolean,
    location: String,
    password:String,
    state: String,
    district: String,
    po: String,
    pin: String
})

const Registration = mongoose.model("Registration",UserRegistration)
const validation = (user)=> {
    const schema = Joi.object({
        firstName:Joi.string().min(3).max(20).required(),
        userTypes:Joi.string().min(3).max(10).required(),
        contctNumber : Joi.string().min(10).max(13).required(),
        email:Joi.string().email().required(),
        location: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(5).max(15).required(),
        state: Joi.string().min(3).max(30).required(),
        district : Joi.string().min(4).max(50).required(),
        po: Joi.string().min(4).max(50).required(),
        pin : Joi.number().min(6).max(7).required()
    });
    return schema.validate(user);
}

export {
    Registration,
    validation
}