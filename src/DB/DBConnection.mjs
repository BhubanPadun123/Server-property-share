import mongoose from "mongoose";


const DBConnection = async () => {
    mongoose.connect(`mongodb+srv://Bhuban:wTecFVZbwfXMcYr5@bhubantodo.kaip10a.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true })

    mongoose.connection.on("connected", () => {
        console.log("Database connection successful!")
    })
    mongoose.connection.on("disconnected", () => {
        console.log("Database disconnected!")
    })
    mongoose.connection.on("error", () => {
        console.log("Error while connecting the database!")
    })
}

export default DBConnection