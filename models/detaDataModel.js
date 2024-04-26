import mongoose from "mongoose";


const metaDataSchema = new mongoose.Schema({
    metaData:{type: Object},
    email:{type:String}
})

const MetaData = mongoose.model("metaData",metaDataSchema)

export default MetaData