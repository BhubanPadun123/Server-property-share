require('dotenv').config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const LOGGR = require('pino')();
const CLOG = LOGGR.child({ type: 'SERVER' });
const routes = require("./routes");
const userCtr = require("./controller/users");
const { connectDB } = require("./utils/db_config");
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const RedisStore = require("connect-redis").default;
// const redis = require("redis");
// const redisClient = redis.createClient("6379", "127.0.0.1");

// redisClient.connect().catch(console.error)

// let redisStore = new RedisStore({
//     client: redisClient,
//     prefix: "coffeecropcare:",
// });

const app = express();
const PORT = process.env.PORT || 9000; // Use PORT from environment or default to 9000

app.set('view engine', 'pug');

// Middleware for parsing incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(cookieParser());

// Session configuration (production and development differences)
let sess = {
    secret: 'somerandomstring7b563b8018b29d88450e1c18008edc6086cfb',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Will change to true in production for HTTPS
        maxAge: 60000 // 1 minute
    }
};

// If in production, adjust session settings for HTTPS and secure cookies
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust the first proxy
    sess.cookie.secure = true; // Serve secure cookies over HTTPS
    // Optionally, enable Redis for session storage in production
    // sess.store = redisStore;
}

app.use(session(sess));

// Serve static files from public folder
app.use('/static', express.static('public'));

// Database connection
connectDB();

// Example route for rendering a Pug template
app.get("/message", function (req, res) {
    const { name, price } = req.query;
    res.render('message', { name, price });
});

// Use your routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
    CLOG.info(`WMS Listening on Port ${PORT}! Running in ${process.env.NODE_ENV} mode.`);
});
