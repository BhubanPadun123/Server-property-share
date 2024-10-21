const express = require("express");
const path = require("path");
const apiRoute = require("./api_routes");
const router = express.Router();
router.use('/api', apiRoute);

module.exports = router;