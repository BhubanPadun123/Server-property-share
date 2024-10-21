const mysql = require('mysql')
require('dotenv').config()

const DB_POOL = mysql.createPool({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const DB = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const connectDB = () => {
    try {
        DB.connect((err) => {
            if (err) {
                console.log("Something went wrong while connect the DB!!", err)
                return;
            }
            console.log("DB connected successfully!!")
        })
    } catch (error) {
        console.log("Error while connect DB", error)
    }
}

module.exports = {
    connectDB: connectDB,
    DB: DB,
    DB_POOL
}