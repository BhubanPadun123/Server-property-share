import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import multer from 'multer'


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure:false,
    port:process.env.PORT,
    auth: {
        user: process.env.OWNER_GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});


const Storage = multer.diskStorage({
    destination:(req,file,cd)=>{
        console.log("from multer..",req,file,cd)
        cd(null,"uploads/")
    },
    filename:(req,file,cd)=>{
        console.log("from multer1..",req,file,cd)
        cd(null,Date.now()+"-"+file.originalname)
    }
})

export const UploadImage = multer({storage: Storage})