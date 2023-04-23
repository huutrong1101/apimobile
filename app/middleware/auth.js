const asyncHandler = require("./async");
var jwt = require("jsonwebtoken");
const systemConfig = require(__path_configs + "system");
var ErrorResponse = require(__path_utils + "ErrorResponse");
var UserModel = require(__path_models + "user");

exports.protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token)
    return next(new ErrorResponse(401, "Vui lòng đăng nhập tài khoản 1 "));

  try {
    // decode token
    const decoded = jwt.verify(token, systemConfig.JWT_SECRET);
    console.log(decoded);
    req.user = await UserModel.listItems({ id: decoded.id }, { task: "one" });
    console.log(req.user);
    next();
  } catch (err) {
    return next(new ErrorResponse(401, "Vui lòng đăng nhập tài khoản 2"));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(403, "Bạn không có quyền truy cập"));
    }
    next();
  };
};
