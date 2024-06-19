import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import { connectUsingMongoose } from './config/mongodb.js'
import router from "./routes/routes.js"
dotenv.config()
const app = express()
import cors from "cors"




app.use(cors())
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false, // enable set cookie with CORS
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true,limit:"200kb"}))
app.use(express.json({limit:"300kb"}))


//connect DB
connectUsingMongoose()

app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`)
});
