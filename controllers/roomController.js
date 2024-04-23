import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import RoomModel from "../models/roomModel"



export class GetRoomDetails {

    getAllRoomList=async(req,res)=> {
        try {
            const list = await RoomModel.find({})
            if(list){
                return res.status(200).json({status:"success",info:list})
            }else{
                return res.status(401).json({status:"failed",info:"Room collection list empty!!"})
            }
        } catch (error) {
            return res.status(500).json({status:"failed",info:error})
        }
    }

    getSelectedRoom=async(req,res)=>{
        try {
            const {
                roomId
            } = req.params

            const findRoom = await RoomModel.findOne({_id: roomId})
            if(findRoom){
                return res.status(200).json({status:"success",info: findRoom})
            }else{
                return res.status(401).json({status:"failed",info:'room not available in DB!'})
            }
        } catch (error) {
            return res.status(500).json({status:"failed",info: error})
        }
    }

    getParticularUserBookingRoom=async(req,res)=> {
        try {
            const {
                userEmail
            } = req.params

            const all = await RoomModel.find({booked: userEmail})
            if(all){
                return res.status(200).json({status:"success",info:all})
            }else{
                return res.status(501).json({status:"failed",info:"Not Room booked yet!!"})
            }
        } catch (error) {
            return res.status(500).json({status:"failed",info:  error})
        }
    }

}

export class PostRoomDetails{

}

export class ModifyedRoomDetails{

}

export class DeleteRoomDetails{

}