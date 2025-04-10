const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDE_NAME, // Corrected from cloude_name to cloud_name
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
    },
});

module.exports = {
    cloudinary,
    storage
};
