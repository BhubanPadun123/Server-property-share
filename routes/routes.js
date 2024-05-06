import express from 'express'
import {UserGetController, UserPostController} from '../controllers/controller.js'
import { GetRoomDetails,PostRoomDetails,DeleteRoomDetails } from '../controllers/roomController.js'
import { GlobalControl } from '../controllers/globalControl.js'

const router = express.Router()
const UserGetcontroller = new UserGetController()
const UserPostcontroller = new UserPostController()
const GetRoomControl = new GetRoomDetails()
const RoomPostControl = new PostRoomDetails()
const RoomDeleteControl = new DeleteRoomDetails()
const GlobalData = new GlobalControl()



router.get('/login/:email/:password',UserGetcontroller.getUserLogin)



//POST REQUESTS
router.post('/signup', UserPostcontroller.createUser);
router.post("/verifyotp",UserPostcontroller.verifyUserOTP)
router.post("/resetverification",UserPostcontroller.resendVerificationOTP)
router.post('/signin', UserPostcontroller.signInUser);
router.post('/forgot-password', UserPostcontroller.forgotPassword);
router.post('/change-password', UserPostcontroller.changePassword);

router.get('/all-servce-list',GlobalData.getAllServices)
router.post("/register-room",RoomPostControl.handleRoomRegister)
router.post('/metadata-post', RoomPostControl.roomMetaDataModifyer)
router.get('/detadata/:email',RoomPostControl.getMetaData)

router.post('/upload-image',RoomPostControl.HandleUploadImage)
router.post("/delete",RoomPostControl.HandleRemovedImage)



export default router