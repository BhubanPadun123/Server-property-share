import express from 'express';
import DBConnection from './src/DB/DBConnection.mjs';
import cors from "cors"
const App = express();
const port = process.env.PORT || 4000
import { UserLoginRoute,RegistrationRoute,UserVerification} from './src/Routes/User.mjs';

App.use(cors())
const corsOptions = {
    origin: 'http://example.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable set cookie with CORS
    optionsSuccessStatus: 204,
};
App.use(cors(corsOptions))
App.use(express.json())
const server = App.listen(port, () => {
    console.log(`Server start at port http://localhost:${port}`)
})

server.on('listening', () => {
    console.log("Server is successfully start......")
})
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
//conneting wuth the database.
(async()=> await DBConnection())()

//Routing the query
App.post("/register",RegistrationRoute)
App.post("/login",UserLoginRoute)
App.get("/verify/:email/:token",UserVerification)