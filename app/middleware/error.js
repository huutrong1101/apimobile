var ErrorResponse = require(__path_utils + "ErrorResponse");
var notify = require(__path_configs + "notify");
const cloudinary = require("cloudinary").v2;

const errorHandler = (err, req, res, next) => {
  console.log(err.name.yellow);
  let error = { ...err };

  if (error.name === "CastError") {
    let message = notify.ERROR_CASTERROR;
    error = new ErrorResponse(404, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "SEVER ERROR",
  });

  const fileData = req.file;

  if (fileData) cloudinary.uploader.destroy(fileData.filename);
};

module.exports = errorHandler;
