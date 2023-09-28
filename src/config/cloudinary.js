const cloudinary = require('cloudinary').v2;
const config = require('.');

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true
});
//console.log(cloudinary.config().cloud_name);
const uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder : 'blogs-ds'
    });
}

const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
}

module.exports =  { uploadImage, deleteImage }