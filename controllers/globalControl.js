import User from "../models/userModel.js";
import MetaData from "../models/detaDataModel.js";
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
dotenv.config();



export class GlobalControl {
    getAllServices=async(req,res)=> {
        try {
            const allList = await MetaData.find({})
            if(allList){
                res.status(200).json({status:"success",info: allList})
            }else{
                res.status(401).json({status:"info",info:"No data found!!!"})
            }
        } catch (error) {
            res.status(500).json({status:"error",info:error})
        }
    }
}