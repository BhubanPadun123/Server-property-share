import mongoose from "mongoose";
import Joi from "joi";


const Room = new mongoose.Schema({
    propertyTypes: Array,
    ownerName: String,
    ownerContectNumber: Number,
    ownerEmail: String,
    houseNo: String,
    state: String,
    district: String,
    city_town: String,
    pin: Number,
    location_details: String
})

const RoomRegister = mongoose.model('RoomRegister', Room)

const validation = (room) => {
    const schema = Joi.object({
        propertyTypes : Joi.array().min(1).max(3).required(),
        ownerName : Joi.string().min(3).max(20).required(),
        ownerEmail : Joi.string().min(6).max(30).required(),
        ownerContectNumber : Joi.number().min(10).max(12).required(),
        houseNo : Joi.string().min(3).max(10).required(),
        state : Joi.string().min(4).max(20).required(),
        district : Joi.string().min(6).max(20).required(),
        city_town : Joi.string().min(5).max(30).required(),
        pin : Joi.number().min(4).max(7).required(),
        location_details : Joi.string().min(4).max(60).required()
    })
    return schema.validate(room)
}

export {
    RoomRegister,
    validation
}