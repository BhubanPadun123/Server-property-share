import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { transporter } from "../config/nodemailerConfig.js";
import dotenv from "dotenv";
dotenv.config();

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
                        const matchPassword = await bcrypt.compare(password,findUser.password)
                        if(matchPassword){
                            return res.status(200).json({ status: "success", info: 'login successfully!!' })
                        }else{
                            return res.status(402).json({status:"failed",info:"Wrong Password"})
                        }                   
                    }
                }else{
                    return res.status(501).json({status:"error",info:"DB not existing"})
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
        const { username, email, password, cpassword } = req.body;
        if (password !== cpassword) {
            return res.status(400).json({status:"failed",info:"Password misMatch!!!"});
        }
        //check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({status:"failed" ,info: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        try {
            await newUser.save();
            res.status(201).json({status:"success" ,info: "User created successfully" });
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    };

    //sign in
    signInUser = async (req, res) => {
        const { email, password } = req.body;
        //Recaptcha
        const recaptcha = req.body['g-recaptcha-response'];

        if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
            return res.status(404).render("signin", { message: "Please select captcha" });
        }

        try {
            const existingUser = await User.findOne({ email: email });

            if (!existingUser)
                return res.status(404).render("signin", { message: "User doesn't exist" });

            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordCorrect)
                return res.status(400).render("signin", { message: "Invalid credentials || Incorrect Password" });
            req.session.userEmail = email;
            res.redirect('/user/homepage');

        }
        catch (error) {
            res.status(500).render("signin", { message: error.message });

        }
    }

    //forgot password
    forgotPassword = async (req, res) => {
        const { email } = req.body;
        try {
            const existingUser = await User.findOne({ email: email });
            if (!existingUser)
                return res.status(404).render("forgot-password", { message: "User doesn't exist" });

            // Generate random password
            const newPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            try {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Password Reset',
                    text: `Your new password is: ${newPassword}`
                });
            } catch (error) {
                console.log(error);
                return res.status(404).render("forgot-password", { message: "Not valid Email" + error });
            }

            existingUser.password = hashedPassword;
            await existingUser.save();

            res.status(201).render("signin", { message: "New Password sent to your email" });
        }
        catch (error) {
            res.status(500).render("forgot-password", { message: error.message });
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
