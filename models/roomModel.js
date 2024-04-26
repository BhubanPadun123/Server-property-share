import mongoose from "mongoose";



const RoomModelSchema = new mongoose.Schema({
    ownerName:{type: String},
    roomSize:{type: String},
    email:{type: String},
    contactNumber: {type: Number},
    district:{type: String},
    state:{ type: String},
    occopancy:{ type: Array},
    roomStatus:{type: String},
    roomHolding:{type: Array},
    images:{type: Array},
    ownerName: {type: String},
    fullAddress:{type: Array}
})

const RoomModel = mongoose.model('roommodel',RoomModelSchema)

export default RoomModel