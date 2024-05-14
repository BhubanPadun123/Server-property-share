import mongoose from "mongoose";


const metaDataSchema = new mongoose.Schema({
    metaData:{
        address:{type:Object},
        serviceType:{type:String},
        ownerDetails:{type: Object},
        serviceDetails:{type:Object},
        propertyDetails:{type: Object}
    },
    email:{type:String},
    images:{type:Array}
})

const MetaData = mongoose.model("metaData",metaDataSchema)

export default MetaData