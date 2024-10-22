const express = require("express");
const userCtr = require("../controller/users");
const node_utils = require("../utils/node_utils");
const { updateUserData } = require("../controller/update")
const { Mail } = require("../controller/mail")

const router = express.Router();

const ST_CODE = {
    200: "SUCCESS",
    201: "RESOURCE_CREATED",
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    404: "NOT_FOUND",
    500: "INERNAL_SERVER_ERROR",
};

function generateRandomSixDigit() {
    return Math.floor(100000 + Math.random() * 900000);
}
router.post('/login', function (req, res) {
    const reqBody = req.body || {};
    const userName = reqBody.email;
    const password = reqBody.password;
    console.log(userName,"<===>",password)
    // if (typeof userName !== "string" || typeof password != "string") {
    //     res.status(400).json({ message: "Invalid userName or password", status: "BAD_REQUEST", statusCode: 400 });
    //     return;
    // }
    userCtr.authenticateUser(userName, password).then(function (userInfo) {
        const sessionId = node_utils.createHash(userInfo.userName + Date.now() + "web");
        const to = userName;
        const otp = generateRandomSixDigit()
        const subject = "ukum24x7.life user OTP verification"
        const message = `Welcome to ukum24x7.life property rental side.Your one time password is ${otp}`
        let userData = {
            otp: otp
        }
        let user = JSON.parse(userInfo.userid.userData)
        if (user && user.verify) {
            return res.status(200).json({
                "message": "User login successfully",
                "token": sessionId,
                "user": userInfo
            })
        }
        updateUserData(userData, to).then((result) => {
            Mail(to, subject, message).then((ans) => {
                return res.status(200).json({
                    "message": "User login successfully",
                    "token": sessionId,
                    "user": userInfo
                })
            }).catch((err) => {
                console.log("Error==>", err)
                res.status(500).json({ error: JSON.stringify(err) })
            })
        }).catch((err) => {
            console.log("Error==>", err)
            res.status(500).json({
                errorData: JSON.stringify(err)
            })
        })
    }).catch(function (err) {
        console.log("error--->", err)
        if (err.statusCode) {
            return res.status(err.statusCode).json({ "message": err.message, status: ST_CODE[err.statusCode], statusCode: err.statusCode });
        } else {
            return res.status(400).json({ message: "Invalid userName or password", status: "BAD_REQUEST", statusCode: 400 });
        }
    });
});
router.get('/signout', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.status(400).json({ "message": "Invalid user details", "status": "BAD_REQUEST", "statusCode": 400 });
        } else {
            // res.status(200).json({"message": "User token expired", "status": "SUCCESS", "statusCode": 200});
            res.render('login', { title: 'Login' });
        }
    })
});

router.post('/register', function (req, res) {
    const user = req.body;
    const {
        userName,
        password,
        email,
        userData,
        userRole
    } = user
    userCtr.createNewUser(userName, password, email, userData, userRole).then(function () {
        return res.status(200).json({});
    }).catch(function (e) {
        return res.status(e.statusCode).json(e);
    });
});

module.exports = router;