const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const systemConfig = require(__path_configs + "system");

cloudinary.config({
  cloud_name: systemConfig.CLOUDINARY_NAME,
  api_key: systemConfig.CLOUDINARY_KEY,
  api_secret: systemConfig.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "learn_nodejs",
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
