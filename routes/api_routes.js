const express = require("express");
const authRoutes = require("./auth_routes");
const router = express.Router();
const userMail = require("../APIFunction/VerifyUser")
const useRoom = require("../APIFunction/Room")
const ConnectWithUs = require("../APIFunction/Connect")

router.use('/auth', authRoutes);
router.use('/verify',userMail)
router.use('/room',useRoom)
router.use('/connect',ConnectWithUs)
module.exports = router;