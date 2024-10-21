const express = require('express')
const Mail = require("../controller/mail")
const {
    updateUserData,
    verifyOtp
} = require("../controller/update")


const router = express.Router()

router.post('/user',function(req,res){
    const reqBody = req.body||{};
    const to = reqBody.email;
    const subject = reqBody.subject;
    const message = reqBody.message;

    if(!to){
        res.status(500).json({
            error:"Email field is empty!!"
        })
        return
    }
    Mail.Mail(to,subject,message).then((response)=> {
        res.status(200).json({
            message:"Mail send sucessfully!!!"
        })
    }).catch((error)=>{
        res.status(500).json({
            error:JSON.stringify(error)
        })
    })
})
function generateRandomSixDigit() {
    return Math.floor(100000 + Math.random() * 900000);
}
router.post("/otp/user",function(req,res){
    const reqBody = req.body;
    const email = reqBody.email;
    const otp = reqBody.otp;
    verifyOtp(email,otp).then((result)=>{
        return res.status(200).json({data:JSON.stringify(result)})
    }).catch((err)=>{
        return res.status(500).json({errorData:JSON.stringify(err)})
    })
})
router.post('/otp',function(req,res){
    const reqBody = req.body
    const to = reqBody.email;
    const otp = generateRandomSixDigit()
    const subject = "ukum24x7.life user OTP verification"
    const message = `Welcome to ukum24x7.life property rental side.Your one time password is ${generateRandomSixDigit()}`
    if(!to){
        res.status(500).json({
            error:"Email should not be empty"
        })
        return;
    }
    let userData = {
        otp:otp
    }
    updateUserData(userData,to).then((result)=> {
        Mail.Mail(to,subject,message).then((ans)=> {
            res.status(200).json({message:"OTP send successfully!!!"})
        }).catch((err)=> {
            console.log("Error==>",err)
            res.status(500).json({error:JSON.stringify(err)})
        })
    }).catch((err)=> {
        console.log("Error==>",err)
        res.status(500).json({
            errorData:JSON.stringify(err)
        })
    })
})

module.exports = router