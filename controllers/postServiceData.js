import mongoose from "mongoose";
import MetaData from "../models/detaDataModel.js";


export default class PostServiceData{
    PostLabourService = async(props)=> {
        let resData = {
            error: null,
            response : null
        }
        const {
            email,
            images,
            metaData
        } = props

        try {
            const {
                candidateName,
                serviceList,
                serviceType,
                email,
                village,
                pinCode,
                employeeContactNumber,
                employeeName,
                state,
                town,
                district
            } = metaData

            const data = new MetaData({
                metaData:{
                    address:{
                        village,
                        pinCode,
                        state,
                        district,
                        town,
                    },
                    ownerDetails:{
                        candidateName,
                        employeeContactNumber,
                        employeeName,
                        email
                    },
                    serviceType:serviceType,
                    serviceDetails: serviceList
                },
                email: email,
                images: images
            })

            await data.save().then((res)=> {
                resData = {
                    error: null,
                    response: res
                }
            }).catch((err) => {
                resData = {
                    error: err,
                    response: null
                }
            })
            
        } catch (error) {
            resData = {
                error: error,
                response: null
            }
        }
        
        return resData
    }
    
    PostTractorService = async(props)=> {
        let resData = {
            error: null,
            response:null
        }
        const {
            email,
            images,
            metaData
        } = props

        try {
            const {
                candidateName,
                serviceList,
                serviceType,
                email,
                addressDetails,
                amountChargeDetail,
                contactDetails
            } = metaData
            const data = new MetaData({
                email: email,
                images: images,
                metaData:{
                    address: addressDetails,
                    serviceDetails:amountChargeDetail,
                    ownerDetails:{
                        candidateName,
                        contactDetails
                    },
                    serviceType:serviceType,
                    propertyDetails:serviceList
                }
            })

            await data.save().then((res)=> {
                resData= {
                    error: null,
                    response: res
                }
            }).catch((err)=> {
                resData = {
                    error: err,
                    response : null
                }
            })
        } catch (error) {
            resData = {
                error: error,
                response : null
            }
        }

        return resData
    }
    PostHospitalService=async(props)=> {
        let resData = {
            error:null,
            response:null
        }
        const {
            email,
            images,
            metaData
        } = props
        try {
            const {
                address,
                serviceType,
                ownerDetails,
                serviceDetails,
                propertyDetails
            } = metaData

            const data = new MetaData({
                metaData:{
                    address:address,
                    serviceDetails:serviceDetails,
                    ownerDetails:ownerDetails,
                    serviceType:serviceType,
                    propertyDetails:propertyDetails
                },
                email:email,
                images:images
            })

            await data.save().then((res)=> {
                resData={
                    error:null,
                    response:res
                }
            }).catch((error)=> {
                resData = {
                    error: error,
                    response:null
                }
            })
            
        } catch (error) {
            resData={
                error:error,
                response:null
            }
        }

        return resData
    }
    PostRoomService=async(props)=>{
 
        let resData = {
            error:{},
            response:{}
        }
        const {
            roomSearch,
            adderess,
            roomAminities,
            roomDetail,
            candidateName,
            serviceList,
            serviceType,
            candidateDetails,
            email,
            images
        } = props
        
        try {
            const data = new MetaData({
                metaData:{
                    address: adderess,
                    serviceType: serviceType,
                    ownerDetails: candidateDetails,
                    serviceDetails: roomSearch,
                    propertyDetails: {
                        serviceList,
                        roomAminities,
                        roomDetail,
                        candidateName
                    }
                },
                email:email,
                images:images
            })
            await data.save().then((res)=> {
                resData.response = res
                resData.error = null
            }).catch((err)=> {
                resData = {
                    error: err,
                    response: null
                }
            })
        } catch (error) {
            resData={
                error:error,
                response:null
            }
        }

        return resData
    }
}