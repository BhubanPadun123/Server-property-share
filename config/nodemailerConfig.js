import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import multer from 'multer'

// Create a transporter
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.OWNER_GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});


const Storage = multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"uploads/")
    },
    filename:(req,file,cd)=>{
        cd(null,Date.now()+"-"+file.originalname)
    }
})

export const UploadImage = multer({storage: Storage})