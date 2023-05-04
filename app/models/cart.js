const { ObjectId } = require("bson");

const MainModel = require(__path_schemas + "cart");
const ProductModel = require(__path_schemas + "product");

module.exports = {
  listItems: (params, option) => {
    let id = params.id ? params.id : "";
    params = params.id ? params.query : params;

    // coppy params
    const queryFind = { ...params };

    let find, select, sort;

    // Create fields remove
    let removeFields = ["select", "sort", "page", "limit"];

    // Remove fields
    removeFields.forEach((param) => delete queryFind[param]);

    // Create query string
    console.log(queryFind);
    let queryStr = JSON.stringify(queryFind);

    // replace
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (find) => `$${find}`
    );

    //parse
    find = JSON.parse(queryStr);

    // select fields
    if (params.select) {
      select = params.select.split(",").join(" ");
    }

    // sort fields
    if (params.sort) {
      sort = params.sort.split(",").join(" ");
    }

    //pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 6;
    const skip = (page - 1) * limit;

    if (option.task == "all") {
      return MainModel.find(find)
        .populate({ path: "product", select: "name" })
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    }
  },

  getCart: (params) => {
    const cartItem = MainModel.findOne({ userId: params.userId }).select({});
    return cartItem;
  },

  create: async (item) => {
    // Kiểm tra xem giỏ hàng của user đã tồn tại chưa
    const cartItem = await MainModel.findOne({ userId: item.userId });

    if (cartItem) {
      // Nếu giỏ hàng đã tồn tại, ta cập nhật số lượng sản phẩm trong giỏ hàng
      let isUpdated = false;

      // Duyệt qua tất cả các sản phẩm trong giỏ hàng
      for (let i = 0; i < cartItem.products.length; i++) {
        if (cartItem.products[i].productId === item.products[0].productId) {
          cartItem.products[i].quantity += item.products[0].quantity;
          isUpdated = true;
          break;
        }
      }

      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, ta thêm sản phẩm vào giỏ hàng
      if (!isUpdated) {
        cartItem.products.push(item.products[0]);
      }

      return cartItem.save();
    } else {
      // Nếu giỏ hàng chưa tồn tại, ta tạo giỏ hàng mới và lưu vào database
      const newCartItem = new MainModel(item);
      return newCartItem.save();
    }
  },

  deleteItem: (params) => {
    return MainModel.deleteOne({ userId: params.userId });
  },

  updateItem: async (params) => {
    const cart = await MainModel.findOne({ userId: params.userId });
    if (cart) {
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === params.pId
      );
      const product = cart.products[productIndex];
      let newQuantity;
      if (params.type === "increase") {
        newQuantity = parseInt(product.quantity) + 1;
      } else if (params.type === "decrease") {
        newQuantity = parseInt(product.quantity) - 1;
      } else if (params.type === "delete") {
        newQuantity = 0;
      }

      if (newQuantity <= 0) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = newQuantity.toString();
      }
      await cart.save();
      return cart;
    }
  },
};
