import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import RoomModel from "../models/roomModel.js"
import User from "../models/userModel.js";
import { transporter } from "../config/nodemailerConfig.js";
import MetaData from "../models/detaDataModel.js";



export class GetRoomDetails {

    getAllRoomList = async (req, res) => {
        try {
            const list = await RoomModel.find({})
            if (list) {
                return res.status(200).json({ status: "success", info: list })
            } else {
                return res.status(401).json({ status: "failed", info: "Room collection list empty!!" })
            }
        } catch (error) {
            return res.status(500).json({ status: "failed", info: error })
        }
    }

    getSelectedRoom = async (req, res) => {
        try {
            const {
                roomId
            } = req.params

            const findRoom = await RoomModel.findOne({ _id: roomId })
            if (findRoom) {
                return res.status(200).json({ status: "success", info: findRoom })
            } else {
                return res.status(401).json({ status: "failed", info: 'room not available in DB!' })
            }
        } catch (error) {
            return res.status(500).json({ status: "failed", info: error })
        }
    }

    getParticularUserBookingRoom = async (req, res) => {
        try {
            const {
                userEmail
            } = req.params

            const all = await RoomModel.find({ booked: userEmail })
            if (all) {
                return res.status(200).json({ status: "success", info: all })
            } else {
                return res.status(501).json({ status: "failed", info: "Not Room booked yet!!" })
            }
        } catch (error) {
            return res.status(500).json({ status: "failed", info: error })
        }
    }

}

export class PostRoomDetails {

    handleRoomRegister = async (req, res) => {
        try {
            const {
                email,
                contactNumber,
                district,
                state,
                occopancy,
                fullAddress,
                roomStatus,
                roomHolding,
                images,
                ownerName,
                roomSize
            } = req.body.props
            const checkUser = await User.findOne({ email: email })

            if (!checkUser) {
                return res.status(401).json({ status: "info", info: "User does not exist!!" })
            }

            const newRoom = new RoomModel({
                ownerName: ownerName,
                roomSize: roomSize,
                email: email,
                contactNumber: contactNumber,
                district: district,
                state: state,
                occopancy: occopancy,
                fullAddress: fullAddress,
                roomStatus: roomStatus,
                roomHolding: roomHolding,
                images: images
            })

            await newRoom.save().then(async (result) => {
                await transporter.sendMail({
                    to: email,
                    from: process.env.OWNER_GMAIL,
                    subject: "Room Register successfully!!",
                    text: "Your Room is successfully posted in the platform"
                }).then(() => {
                    return res.status(200).json({ status: "success", info: result })
                }).catch((e) => {
                    return res.status(402).json({ status: "warning", info: "Email not able to send your address", message: e })
                })
            }).catch((err) => {
                return res.status(501).json({ status: "error", info: err })
            })
        } catch (error) {
            return res.status(500).json({ status: "error", info: error })
        }
    }

    roomMetaDataModifyer = async (req, res) => {

        try {
            const {
                email,
                metaData
            } = req.body.props

            if (!email) {
                return res.status(401).json({ status: "warning" })
            }

            const isUserExist = await User.findOne({ email: email })

            if (!isUserExist) {
                res.status(500).json({ status: "error", info: "User Does not Exist!!" })
            } else {
                const isMetaDataExist = await MetaData.findOne({ email: email })

                if (!isMetaDataExist) {
                    const newMetadata = new MetaData({
                        email: email,
                        metaData: metaData
                    })

                    await newMetadata.save()
                    return res.status(200).json({status:"success",info: newMetadata})
                } else {
                    if (isMetaDataExist.metaData.serviceType == metaData.serviceType) {
                        const updateProjectMetadata = await MetaData.updateOne({ email: email }, { $set: { metaData: metaData } })
                        if (updateProjectMetadata) {
                            return res.status(200).json({ status: "Data updated successfully", info: updateProjectMetadata })
                        }
                    } else {
                        const newMetadata = new MetaData({
                            email: email,
                            metaData: metaData
                        })

                        await newMetadata.save()

                        return res.status(200).json({status:"success",info: newMetadata})
                    }
                }
            }

        } catch (error) {
            return res.status(500).json({ status: "error", info: error })
        }
    }

    getMetaData = async (req, res) => {
        try {
            const {
                email
            } = req.params

            const findData = await MetaData.findOne({ email: email })

            if (findData) {
                 res.status(200).json({ status: "success", info: findData })
            } else {
                 res.status(403).json({ status: "warning", info: "User does not exist!!!" })
            }
        } catch (error) {
             res.status(500).json({ status: "error", info: error })
        }
    }

    HandleUploadImage=async(req,res)=> {
        try {
            const {
                email,
                image
            } = req.body.props
            const metaData = await MetaData.findOne({email:email})
            if(metaData){
                metaData.images.push({
                    src:image,
                    key: Math.random().toString(36).substring(2, 15)
                })

                await metaData.save().then((result)=> {
                    res.status(200).json({message:"Image Upload successfull",info:result})
                }).catch((error)=> {
                    res.status(401).json({status:"error",info:error})
                })
            }else{
                res.status(500).json({status:"error",info:"Error while upload image"})
            }
        } catch (error) {
            res.send("Error===>",JSON.stringify(error))
        }
    }
    HandleRemovedImage=async(req,res)=> {

       
        try {
            const {
                email,
                image
            } = req.body.props

            const metaData = await MetaData.findOne({email:email})

            if(metaData){
                if(metaData.images.length > 0){
                    let imagesCollection = metaData.images.filter((item)=> item.src !== image)
                    metaData.images = imagesCollection;
                    await metaData.save().then((result)=> {
                        return res.status(200).json({status:"success",info: result})
                    }).catch((error)=> {
                        return res.status(401).json({status:"warning",info:error})
                    })
                }
            }else{
                res.status(500).json({status:"error",info:"Error while Delete the image"})
            }
            
        } catch (error) {
            res.status(500).json({status:"error",info:error})
        }
    }

}

export class ModifyedRoomDetails {

}

export class DeleteRoomDetails {

}