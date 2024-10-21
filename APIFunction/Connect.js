const express = require('express')
const {Mail} = require("../controller/mail") 

const router = express.Router();

router.post('/connect_with_us',async function(req,res){
    try {
        const reqBody = await req.body
        const {
            name,
            email,
            qualification,
            phone,
            experence,
            message} = reqBody
        const candidateData = {
            candidateName:name,
            candidateEmail: email,
            candidateQualification: qualification,
            candidatePhone: phone,
            candidateExperence : experence,
            message:message
        }
        const to = "bhubanpadun15m37@gmail.com"
        Mail(to,"Candidate Seeking job",JSON.stringify(candidateData)).then((ans)=> {
            return res.status(200).json({ans})
        }).catch((err)=> {
            return res.status(500).json({err})
        })
    } catch (error) {
        return res.status(500).json({error})
    }
})


module.exports = router