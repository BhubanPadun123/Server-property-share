import mongoose from "mongoose";


const metaDataSchema = new mongoose.Schema({
    metaData:{type: Object},
    email:{type:String},
    images:{type:Array}
})

const MetaData = mongoose.model("metaData",metaDataSchema)

export default MetaData