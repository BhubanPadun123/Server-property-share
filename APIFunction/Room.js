const express = require('express')
const {
    useCreateRoom,
    useGetAllRooms,
    useGetRow,
    useGetRowById,
    useUpdateRowById,
    useUpdateRow,
    useGetRoomByIds
} = require("../hook/index")
const {Mail}  = require("../controller/mail")

const router = express.Router();

router.post("/upload",function(req,res){
    const reqBody = req.body || {};
    const ownerName = reqBody.ownerName;
    const email = reqBody.email;
    const metaData = reqBody.metaData;

    if(!email || !ownerName){
        return res.status(500).json({
            message:"User email and owner name most be field"
        })
    }
    const data = {
        ownerName,
        email,
        metaData
    }
    useCreateRoom(data).then(async(response)=>{
        await Mail(
            email,
            "Room Register successfully",
            "Thank you for using Ukum24X7.life. You Property is posted successfully. We will connect you soon."
        )
        return res.status(200).json({response})
    }).catch((err)=>{
        return res.status(500).json({err})
    })
})

router.get('/rooms_list',function(req,res){
    useGetAllRooms().then((response)=> {
        return res.status(200).json({response})
    }).catch((error)=> {
        return res.status(500).json({error})
    })
})
router.post('/booking',async function(req,res){
    const reqBody = req.body
    const ownerEmail = reqBody.userName
    const customerData = reqBody.userid
    const selectedRoom = reqBody.user_data
    await useGetRowById("rooms",selectedRoom.bookingList[0]).then(async(response)=> {
        let rowData = JSON.parse(response.data)[0]
        let metaData = {}
 
        if(rowData.metaData.booking_list){
            metaData['booking_list'] = [...metaData.booking_list,selectedRoom.bookingList[0]]
        }else{
            metaData['booking_list'] = [selectedRoom.bookingList[0]]
        }
        metaData = {
            ...metaData,
            ...JSON.parse(rowData.metaData)
        }
        await useUpdateRowById("rooms",selectedRoom.bookingList[0],JSON.stringify(metaData)).then(async(result)=>{
            await Mail(
                ownerEmail,
                "Room Booking Message",
                `Hi ${ownerEmail} , Following details customer is looking your room. ${customerData.email}`
            ).then(()=>{
                useGetRow("users",customerData.email).then((results)=>{
                    const userRowData = JSON.parse(results.data)[0]
                    let userData = {}
                    if(JSON.parse(userRowData.userData).hasOwnProperty('booking_list')){
                        userData['booking_list'] = [...JSON.parse(userRowData.userData).booking_list,selectedRoom.bookingList[0]]
                    }else{
                        userData['booking_list'] = [selectedRoom.bookingList[0]]
                    }
                    userData = {
                        ...userData,
                        ...JSON.parse(userRowData.userData)
                    }
                    useUpdateRow("users",customerData.email,JSON.stringify(userData)).then(async()=>{
                        await Mail(
                            customerData.email,
                            "Thank you so much for using our platform.",
                            `Hi ${customerData.email} , Your room booking is done successfully.You can connect owner with email id. ${ownerEmail}`
                        ).then(()=>{
                            return res.status(200).json({
                                message:"Successfully booking the room"
                            })
                        }).catch((err)=> {
                            return res.status(500).json({err})
                        })
                    }).catch((err)=> {
                        return res.status(500).json({err})
                    })
                }).catch((error)=> {
                    console.log("user update error==>",error)
                    return res.status(500).json({error})
                })
            }).catch((error)=> {
                return res.status(500).json({error})
            })
        }).catch((error)=>{
            console.log("booking error--->",error)
            return res.status(500).json({error})
        })
    }).catch((error)=> {
        return res.status(500).json({error})
    })
})

router.post("/a1/room",async function(req,res){
    try {
        const reqBody = await req.body
        const roomId = reqBody.roomId
        const email = reqBody.email
        console.log("req--->",reqBody)
        const review = {
            rating:reqBody.rating,
            comment:reqBody.comment,
            reviewer:reqBody.userName
        }
        await useGetRowById("rooms",roomId).then((response)=>{
            let rowData = JSON.parse(response.data)[0]
            console.log(JSON.parse(rowData.metaData).reviews,"<<<<<")
            let metaData = {}
            
            if(rowData.metaData){
                metaData = {
                    ...JSON.parse(rowData.metaData)
                }
            }

            if(metaData && metaData.reviews){
                if(Array.isArray(metaData.reviews)){
                    console.log("call1")
                    let reviews = [...metaData.reviews,review]
                    metaData.reviews = reviews
                }
            }else{
                metaData['reviews'] = [review]
            }
            useUpdateRowById("rooms",roomId,JSON.stringify(metaData)).then((ans)=> {
                Mail(
                    email,
                    "Room Review Response",
                    `Thank you for your Property review.`
                ).then(()=>{
                    return res.status(200).json({
                        message:"Review updated successfully"
                    })
                })
            }).catch((err)=> {
                return res.status(500).json({err})
            })
        }).catch((err)=> {
            return res.status(500).json({err})
        })

    } catch (error) {
        return res.status(500).json({error})
    }
})

router.post('/u1/room',async function(req,res){
    try {
        const reqBody = await req.body
        const roomIds = reqBody
        await useGetRoomByIds(roomIds).then((result)=> {
            return res.status(200).json({result})
        }).catch((error)=> {
            return res.status(500).json({error})
        })
    } catch (error) {
        return res.status(500).json({error})
    }
})

module.exports = router