import express from 'express'
import {UserGetController, UserPostController} from '../controllers/controller.js'
import { GetRoomDetails,PostRoomDetails,DeleteRoomDetails } from '../controllers/roomController.js'

const router = express.Router()
const UserGetcontroller = new UserGetController()
const UserPostcontroller = new UserPostController()
const GetRoomControl = new GetRoomDetails()
const RoomPostControl = new PostRoomDetails()
const RoomDeleteControl = new DeleteRoomDetails()


router.get('/login/:email/:password',UserGetcontroller.getUserLogin)



//POST REQUESTS
router.post('/signup', UserPostcontroller.createUser);
router.post("/verifyotp",UserPostcontroller.verifyUserOTP)
router.post("/resetverification",UserPostcontroller.resendVerificationOTP)
router.post('/signin', UserPostcontroller.signInUser);
router.post('/forgot-password', UserPostcontroller.forgotPassword);
router.post('/change-password', UserPostcontroller.changePassword);

router.get('/all-room-list',GetRoomControl.getAllRoomList)
router.post("/register-room",RoomPostControl.handleRoomRegister)
router.post('/metadata-post',RoomPostControl.roomMetaDataModifyer)
router.get('/detadata/:email',RoomPostControl.getMetaData)


export default router