import mongoose from "mongoose";
import { Registration } from "../DB/SchemaModel/UserSchema.mjs";
import { UserToken, } from "../DB/SchemaModel/Token/UserToken.mjs";
import { SendMail } from "../DB/Helper/MailSend.mjs";
import crypto from "crypto"



mongoose.set('strictQuery', true)

const RegistrationRoute = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            userTypes,
            contctNumber,
            location,
            password,
            state,
            district,
            po,
            pin
        } = req.params
        const query = { email: email }
        let isExisUser = await Registration.findOne(query) ? true : false
        if (isExisUser) {
            res.status(400).json({
                message: "This email isalready used in another user"
            })
        } else {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                userTypes: userTypes,
                contctNumber: contctNumber,
                location: location,
                password: password,
                state: state,
                district: district,
                po: po,
                pin: pin
            }
            const { error, value } = Registration.validate(userData)
            if (error) {
                res.status(500).json({
                    message: "Validation error!!",
                    response: error
                })
            } else {
                const newUser = new Registration(value)
                await newUser.save().then(async(result) => {
                    console.log("User register successfull!!")
                    res.status(200).json({
                        message: "User Register successfull",
                        response: result
                    })
                    let token = await new UserToken({
                        userId: userData.email,
                        token : crypto.randomBytes(32).toString("hex")
                    }).save()
                    const message = `${process.env.BASE_URL}/user/verify/${userData.email}/${token.token}`
                    await SendMail(userData.email,"Verifying mail",message)
                    res.send("An Email sent to your account please verify")
                }).catch((error) => {
                    console.log("Error===>", error)
                    res, state(500).json({
                        message: "Error white registration!!",
                        response: error
                    })
                })
            }
        }
    } catch (error) {
        console.log("Register Error===>", error)
        res.status(500).json({
            message: "Error while register!!",
            error: error
        })
    }
}

const UserLoginRoute = async (req, res) => {
    try {
        const {
            email,
            password
        } = res.params
        const query = { email: email }
        const findUser = await Registration.findOne(query)
        if (findUser) {
            res.state(200).json({
                message: "User login successfull",
                response: findUser
            })
        } else {
            console.log("Error while login user!!")
            res.state(400).json({
                message: "Error while login the user."
            })
        }
    } catch (error) {
        console.log("Error while login!!")
        res.state(500).json({
            message: "Error while login user",
            response: error
        })
    }
}

const UserVerification = async(req,res) => {
    try{
        const user = await Registration.findOne({email: req.params.email})
        if(!user){
            console.log("User not found!!")
            res.status(400).json({
                message: "User not found!!"
            })
        }
        const token = await UserToken.findOne({
            userId: req.params.email,
            token:req.params.token
        })
        if(!token){
            console.log("Invalid token!!")
            res.status(400).json({
                message: "User token invalid!!"
            })
        }
        await Registration.updateOne({email:req.params.email,verified: true})
        await UserToken.findOneAndDelete({userId:req.params.email})
        res.send("email verified sucessfully!!")
    }catch(error){
        console.log("Error while verifying the user!!")
        res.status(500).send(error)
    }
}

export {
    RegistrationRoute,
    UserLoginRoute,
    UserVerification
}