import mongoose,{Schema} from "mongoose";



const RoomModelSchema = new mongoose.Schema({
    roomowner:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    mobilenumber:{
        type:Number,
        trim:true,
        unique:true
    },
    metadata:{
        address:{
            po:{
                type:String,
                required:true,
                trim:true,
                lowercase:true
            },
            pincode:{
                type:Number,
                required:true,
                trim:true
            },
            town:{
                type:String,
                required:true,
                trim:true,
                lowercase:true
            },
            district:{
                type:String,
                required:true,
                lowercase:true
            },
            state:{
                type:String,
                required:true,
                lowercase:true,
                trim:true
            }
        },
        roomaminities:{
            roomsize:{
                type:String,
                lowercase:true,
                trim:true
            },
            roomproperties:{
                type:Object,
                required:true
            }
        },
        rentamount:{
            monthrent:{
                type:Number,
                required:true
            },
            advance:{
                type:Number
            }
        }
    }
})

const RoomModel = mongoose.model('roommodel',RoomModelSchema)

export default RoomModel