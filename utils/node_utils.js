const crypto = require("crypto");

// Function to Hash given info
let createHash = function (info) {
	const TYPE = "sha256";
	return crypto.createHash(TYPE).update(info).digest("hex");
};

module.exports = {
	createHash : createHash
};