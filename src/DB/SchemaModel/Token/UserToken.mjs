import mongoose from "mongoose";



const Token = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    token:{
        type: String,
        required : true
    }
})

const UserToken = mongoose.model("UserToken",Token)


export {
    UserToken
}