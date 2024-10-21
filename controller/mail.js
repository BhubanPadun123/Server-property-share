const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:'gmail',
    secure:false,
    port:9000,
    auth: {
        user: "bhubanpadun15m37@gmail.com",
        pass: "fbad ttjt wqrz hmhj",
    },
});
const Mail = (
    to,
    subject,
    message
) => {
    return new Promise(async (resolve, reject) => {
        const info = await transporter.sendMail({
            from: "bhubanpadun15m37@gmail.com",
            to: to,
            subject: subject,
            text: message
        }).then((response) => {
            resolve({ response })
        }).catch((err) => {
            reject({ err })
        });
    })
}

module.exports = {
    Mail
}
