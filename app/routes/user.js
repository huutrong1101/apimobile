var express = require("express");
var router = express.Router();
var asyncHandler = require(__path_middleware + "async");
var ErrorResponse = require(__path_utils + "ErrorResponse");
var uploadCloud = require("../middleware/uploader");
const cloudinary = require("cloudinary").v2;

const controllerName = "user";
const MainModel = require(__path_models + controllerName);
const MainValidate = require(__path_validates + controllerName);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.listItems(req.query, { task: "all" });
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.listItems(
      { id: req.params.id },
      { task: "one" }
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

router.post(
  "/add",
  uploadCloud.single("image"),
  asyncHandler(async (req, res, next) => {
    const fileData = req.file;

    let err = await validateReq(req, res, next);
    if (err) {
      if (fileData) {
        cloudinary.uploader.destroy(fileData.filename);
      }
    } else if (!err) {
      const data = await MainModel.create({
        ...req.body,
        image: fileData.path,
      });
      res.status(201).json({
        success: true,
        data: data,
      });
    }
  })
);

router.put(
  "/edit/:id",
  uploadCloud.single("image"),
  asyncHandler(async (req, res, next) => {
    let err = await validateReq(req, res, next);
    if (!err) {
      const data = await MainModel.editItem(
        {
          id: req.params.id,
          body: req.body,
        },
        { task: "edit" }
      );
      res.status(200).json({
        success: true,
        data: data,
      });
    }
  })
);

router.put(
  "/uploadImage",
  uploadCloud.single("image"),
  asyncHandler(async (req, res, next) => {
    const fileData = req.file;

    const data = await MainModel.uploadImage({
      id: req.body.id,
      image: fileData.path,
    });
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

router.delete(
  "/delete/:id",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.deleteItem(
      { id: req.params.id },
      { task: "one" }
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

module.exports = router;

const validateReq = async (req, res, next) => {
  let err = await MainValidate.validator(req);
  if (Object.keys(err).length > 0) {
    next(new ErrorResponse(400, err));
    return true;
  }
  return false;
};
