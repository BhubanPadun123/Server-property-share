import express from 'express'
import {UserGetController, UserPostController} from '../controllers/controller.js'

const router = express.Router()
const UserGetcontroller = new UserGetController()
const UserPostcontroller = new UserPostController()


router.get('/login/:email/:password',UserGetcontroller.getUserLogin)



//POST REQUESTS
router.post('/signup', UserPostcontroller.createUser);
router.post("/verifyotp",UserPostcontroller.verifyUserOTP)
router.post("/resetverification",UserPostcontroller.resendVerificationOTP)
router.post('/signin', UserPostcontroller.signInUser);
router.post('/forgot-password', UserPostcontroller.forgotPassword);
router.post('/change-password', UserPostcontroller.changePassword);


export default router