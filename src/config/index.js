require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3002,
    MONGO_URI: process.env.MONGO_URI,
    SALT: process.env.SALT,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    TOKEN_TTL: parseInt(process.env.TOKEN_TTL),
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}