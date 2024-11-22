const mysql = require('mysql2');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const DB = isProduction ? mysql.createConnection(urlDB) : mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
// const DB = mysql.createConnection({
//     host:process.env.MYSQLHOST,
//     user:process.env.MYSQLUSER,
//     password:process.env.MYSQLPASSWORD,
//     database:process.env.MYSQLDATABASE
// })
// Function to test connection (no need to call .connect())
const connectDB = () => {
    try {
       DB.connect(err=> {
        if(err){
            console.log("error while db connect!!",err)
        }else{
            console.log("DB Connected successfully!!")
        }
       })
    } catch (error) {
        console.log("Error while connecting to DB", error);
    }
};

module.exports = {
    connectDB: connectDB,
    DB: DB
};
