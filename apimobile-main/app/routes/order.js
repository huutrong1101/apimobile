var express = require("express");
var router = express.Router();
var asyncHandler = require(__path_middleware + "async");
var ErrorResponse = require(__path_utils + "ErrorResponse");
var { protect, authorize } = require(__path_middleware + "auth");

const controllerName = "order";
const MainModel = require(__path_models + controllerName);
// const MainValidate = require(__path_validates + controllerName);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.listItems(req.query, { task: "all" });
    if (!data)
      return res.status(200).json({ success: true, data: "Dữ liệu rỗng" });
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
    const data = await MainModel.getItem({ id: req.params.id });
    if (!data)
      return res.status(200).json({ success: true, data: "Dữ liệu rỗng" });
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

router.get(
  "/item/:id",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.getItemDetail({ id: req.params.id });
    if (!data)
      return res.status(200).json({ success: true, data: "Dữ liệu rỗng" });
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

router.get(
  "/item/:id",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.getItemDetail({ id: req.params.id });
    if (!data)
      return res.status(200).json({ success: true, data: "Dữ liệu rỗng" });
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

router.post(
  "/add",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.create(req.body);
    res.status(201).json({
      success: true,
      data: data,
    });
  })
);

router.put(
  "/edit/:id",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.updateItem({
      id: req.params.id,
      body: req.body,
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
