import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { connectUsingMongoose } from './config/mongodb.js'
import router from "./routes/routes.js"
import authrouter from "./routes/authRoutes.js"
dotenv.config()
const app = express()
import cors from "cors"




app.use(cors())
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable set cookie with CORS
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json());


//connect DB
connectUsingMongoose()

app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`)
});
