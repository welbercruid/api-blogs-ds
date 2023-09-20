require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3002,
    MONGO_URI: process.env.MONGO_URI,
    SALT: process.env.SALT,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    TOKEN_TTL: process.env.TOKEN_TTL,
}