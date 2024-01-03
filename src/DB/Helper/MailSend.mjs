import nodemailer from "nodemailer"


const SendMail = async (props) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 8081,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })
    const mailOptions = {
        from: process.env.USER, // Sender address
        to: props.email, // List of recipients
        subject: 'Node Mailer', // Subject line
        text: 'Hello People!, Welcome to Bacancy!', // Plain text body
    }

    transport.sendMail(mailOptions,function(err,info){
        if(err){
            console.log("Error while send the mail")
            return err
        }else{
            console.log("successfull to send the mail")
            return info
        }
    })
}

export {
    SendMail
}

