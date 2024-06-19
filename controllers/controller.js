import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { transporter } from "../config/nodemailerConfig.js";
import dotenv from "dotenv";
import otpGenerator, { generate } from "otp-generator"
dotenv.config();
import {ApiError} from "../config/apiError.js"
import {ApiResponse} from "../config/apiResponse.js"
import {uploadCloudinary} from "../config/cloudinary.js"

export class UserGetController {

    getUserLogin = async (req, res) => {

        try {
            const {
                email,
                password
            } = req.params
            if (!email || !password) {
                return res.status(401).json({ status: "pendding", info: "Empty field found" })
            }
            const collections = (await mongoose.connection.listCollections())
            if (collections.length > 0) {
                let checkCollection = collections.map((item) => item.name === "users" && item)
                if (checkCollection) {
                    const findUser = await User.findOne({ email: email })
                    if (!findUser) {
                        return res.status(202).json({ status: "pendding", info: "User not exist!!" })
                    } else {
                        const matchPassword = await bcrypt.compare(password, findUser.password)
                        if (matchPassword) {
                            return res.status(200).json({ status: "success", info: 'login successfully!!' })
                        } else {
                            return res.status(402).json({ status: "failed", info: "Wrong Password" })
                        }
                    }
                } else {
                    return res.status(501).json({ status: "error", info: "DB not existing" })
                }
            }
        } catch (error) {
            console.log("Error==>", error)
            return res.status(501).json({ status: 'failed', info: error })
        }
    }

}

export class UserPostController {

    //sign up
    createUser = async (req, res) => {
        const { 
            email, 
            password,
            username,
            userType,
            fullName,
        } = req.body.props;

        //check is all values are available? 
        if(
            [email,password,userType,username,fullName].some((field)=> field && field.trim() === "")
        ){
            throw new ApiError(400,"All fields are mandatory!!")
        }
        //check if user already exists
        const existingUser = await User.findOne({
            $or:[{email},{username}]
        });

        if (existingUser) {
            throw new ApiError(402,"User already exist!!")
        } else {
            const opt = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            const expiredTime = new Date(Date.now() + 5 * 60000)

            const avatarLocalPath = req.files && req.files.avatar[0].path
            if(!avatarLocalPath){
                throw new ApiError(405,"User profile image is not be empty!!")
            }
            const avatar = await uploadCloudinary(avatarLocalPath)


            const newUser =  User.create({
                username:username.toLowerCase(),
                email,
                userType,
                verify:false,
                fullName:fullName.toLowerCase(),
                avatar:avatar.url ? avatar.url :"",
                password,
                verify:false,
                otp: opt,
                otpExpire: expiredTime
            })

            const createdUser = await User.findById(newUser._id).select(
                "-password  -otp  -otpExpire"
            )

            if(!createdUser){
                throw new ApiError(403,"Something went wrong while create the user!!")
            }

            try {                
                transporter.sendMail({
                    to:email,
                    from: process.env.OWNER_GMAIL,
                    text: `OTP Verifivation. i will expire -<h1> ${expiredTime} </h1> and OTP is - <h1>${opt}</h1/>`,
                    subject: "Verify your account."
                })
                res.status(201).json({ status: "success", info: "User created successfully" });
            } catch (error) {
                res.status(409).json({ message: error.message });
            }
        }
    };

    getAccessAndRefreshToken=async(id)=>{
        try {
            const user = await User.findById(id)
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken
            user.refreshToken = refreshToken
            await user.save({validateBeforeSave:false})

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new ApiError(500,"Something went wrong while refresh the access  token!!")
        }
    }

    //login
    signInUser = async (req, res) => {
        
        const { email, password } = req.body.props;

        try {
            if(!email || !password){
                throw new ApiError(401,"Email and password required field!!!")
            }
            const existingUser = await User.findOne({ email: email });

            if(!existingUser) {
                throw new ApiError(501,"User does not exist!!")
            }
            //const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            const isCorrectPassword = await existingUser.isPasswordCorrect(password)
            
            if(!isCorrectPassword){
                throw new ApiError(406,"Password is incorrect!!")
            }
            else{
                const {accessToken,refreshToken} = await this.getAccessAndRefreshToken(existingUser._id)
                const loginUser = await User.findById(existingUser._id).select("-password  -refreshToken")

                const options = {
                    httpOnly:true,
                    secure: true
                }

                return res.status(200).cookie(
                    "accessToken",accessToken,options
                ).cookie(
                    "refreshToken",refreshToken,options
                ).json(
                    new ApiResponse(
                        200,
                        "User Login successfully!!"
                    )
                )
            }
        }
        catch (error) {
            res.status(500).json({ status: "failed", info: error })
        }
    }

    sendOPT = async (props) => {
        try {
            const {
                email
            } = props
            console.log("email-->",email,process.env.OWNER_GMAIL)
            const opt = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            const expiredTime = new Date(Date.now() + 5 * 60000)

            const updateUser = await User.updateOne({ email: email }, { $set: { otp: opt, otpExpire: expiredTime } })
            if (updateUser) {
                await transporter.sendMail({
                    from: process.env.OWNER_GMAIL,
                    to: email,
                    subject: "OTP Verification Number",
                    text: `Your One Time OTP is ${opt}`
                })
            } else {
                console.log("Error")
            }
        } catch (error) {
            console.log("Error-->",error)
        }
    }
    verifyUserOTP = async (req, res) => {
        const {
            email,
            otp
        } = req.body.props

        try {
            const findUser = await User.findOne({ email: email })
            if (otp != findUser.otp.toString()) {
                //compared the expire time
                let currentTime = new Date(Date.now())
                let expiredTime = new Date(findUser.otpExpire)
                if(currentTime > expiredTime){
                    res.status(500).json({status:"expired",info:"OTP Expired"})
                }else{
                    res.status(402).json({ status: "warning", info: "Invalid OTP enter" })
                }                
            } else {
                const currentDate = new Date()
                if (currentDate < findUser.otpExpire) {
                    const verifyUser = await User.updateOne({ email: email }, { $set: { verify: true } })
                    await transporter.sendMail({
                        from:process.env.OWNER_GMAIL,
                        to:email,
                        subject:"User Verify Successfully!!!",
                        html:"<h1>Thank you for successfully verifying your account</h1>"
                    })
                    res.status(200).json({ status: "success", info: "OTP verifying successfully!!" })
                } else {
                    res.status(301).json({ status: "warning", info: "OTP expired" })
                }
            }
        } catch (error) {
            res.status(500).json({ info: "failed", info: error })
        }
    }
    resendVerificationOTP = async (req, res) => {
        const {
            email
        } = req.body.props

        try {
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            const expiredTime = new Date(Date.now() + 5 * 60000)
            const updateUser = await User.updateOne({ email: email }, { $set: { otp: otp, otpExpire: expiredTime } })
            if (updateUser) {
                await this.sendOPT({ email: email })
                res.status(200).json({ status: "success", info: "OTP reset successfully!!" })
            } else {
                res.status(401).json({ status: "failed", info: "API called failed while fetch data" })
            }
        } catch (error) {
            res.status(500).json({ status: "failed", info: error })
        }
    }

    //forgot password
    forgotPassword = async (req, res) => {
        const {
            email,
            newPassword,
            cNewPassword
        } = req.body.props;
        try {
            if (newPassword !== cNewPassword) {
                return res.status(403).json({ status: "warning", info: "Password misMatch" })
            }
            const existingUser = await User.findOne({ email: email });

            if (!existingUser) {
                return res.status(402).json({ status: 'error', info: "User does not exist" })
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            try {
                const updatePassword = await User.updateOne({ email: email }, { $set: { password: hashedPassword } })
                if (updatePassword) {
                    await transporter.sendMail({
                        from: process.env.OWNER_GMAIL,
                        to: email,
                        subject: 'Password Reset',
                        text: `Your new password is: ${newPassword}`
                    });
                    return res.status(200).json({ status: "success", info: "Password updated successfully!!" })
                }
            } catch (error) {
                return res.status(404).json({ status: "failed", info: "Not valid Email" + error });
            }
        }
        catch (error) {
            res.status(500).json({ status: 'error', info: error.message });
        }
    }

    //change password
    changePassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        try {
            const email = req.session.userEmail;
            const existingUser = await User.findOne({ email: email });
            if (!existingUser)
                return res.status(404).render("change-password", { message: "User doesn't exist" });

            const isPasswordCorrect = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordCorrect)
                return res.status(400).render("change-password", { message: "Invalid credentials" });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingUser.password = hashedPassword;
            await existingUser.save();
            res.status(201).render("signin", { message: "Password changed successfully" });
        }
        catch (error) {
            res.status(500).render("change-password", { message: error.message });
        }
    }


}
