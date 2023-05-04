var express = require("express");
var router = express.Router();
var asyncHandler = require(__path_middleware + "async");
var { protect, authorize } = require(__path_middleware + "auth");

const controllerName = "cart";
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
  "/:userId",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.getCart({ userId: req.params.userId });
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
  "/edit/:type/:userId/:pId",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.updateItem(req.params);
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

router.delete(
  "/delete/:userId",
  asyncHandler(async (req, res, next) => {
    const data = await MainModel.deleteItem({ userId: req.params.userId });
    res.status(200).json({
      success: true,
      data: data,
    });
  })
);

module.exports = router;
