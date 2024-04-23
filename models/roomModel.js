import mongoose from "mongoose";



const RoomModelSchema = new mongoose.Schema({
    roomOwnerName:{type: String,required: true},
    roomSize:{type: String},

})

const RoomModel = mongoose.model('roommodel',RoomModelSchema)

export default RoomModel