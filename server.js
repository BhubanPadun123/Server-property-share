const express = require("express");
const bodyParser = require("body-parser");
const LOGGR = require('pino')();
const CLOG = LOGGR.child({ type: 'SERVER' });
const routes = require("./routes");
const userCtr = require("./controller/users");
const { connectDB } = require("./utils/db_config");
const session = require('express-session')
const cookieParser = require('cookie-parser');
// const RedisStore = require("connect-redis").default
// const redis = require("redis");
// const redisClient = redis.createClient("6379", "127.0.0.1");

// redisClient.connect().catch(console.error)

// let redisStore = new RedisStore({
//     client: redisClient,
//     prefix: "coffeecropcare:",
// })

const app = express();
const PORT = 9000;

app.set('view engine', 'pug')

// Middleware for parsing incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('build'));
app.use(cookieParser());

// var sess = {
//     store: redisStore,
//     secret: 'somerandomstring7b563b8018b29d88450e1c18008edc6086cfb',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // This will only work if you have https enabled!
//         maxAge: 60000 // 1 min
//     }
// }

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    //sess.cookie.secure = true // serve secure cookies
}
//app.use(session(sess));

// const WHITE_LIST = [
//     "/status",
//     "/api/auth/signin",
//     "/api/auth/register",
//     "/api/auth/signout",
//     "/api/price",
// ];

app.use('/static', express.static('public'))
// Middleware for request Authorization
// app.use(function (req, res, next) {

//     if (req.url.indexOf("/api/") == -1) {
//         next();
//         return;
//     }
    
//     if(req.url.indexOf("/api/auth/signin") !== -1 && req.session.sessionid ){
//         res.redirect("/api/auth/dashboard")
//     }

//     if (WHITE_LIST.indexOf(req.url) != -1) {
//         next();
//         return;
//     }

//     const sessionid = req.session.sessionid || "";
//     if (!sessionid) {
//         res.redirect("/api/auth/signin")
//         return;
//     } else {
//         next()
//     }
// });
connectDB()

app.get("/message", function (req, res) {
    const { name, price } = req.query
    res.render('message', { name, price })
})

app.use('/', routes);

app.listen(PORT, () => {
    CLOG.info(`WMS Listening on Port ${PORT}!`);
});