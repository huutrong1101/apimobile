const { ObjectId } = require("bson");

const MainModel = require(__path_schemas + "category");
const ProductModel = require(__path_schemas + "product");

const cloudinary = require("cloudinary").v2;
const { extractPublicId } = require("cloudinary-build-url");

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
    console.log(find);
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
    if (option.task == "getProduct") {
      if (id != "all") Object.assign(find, { "category.id": id });
      return ProductModel.find(find)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    }
  },
  create: (item) => {
    return new MainModel(item).save();
  },
  deleteItem: async (params, option) => {
    if (option.task == "one") {
      const product = await MainModel.findById(params.id);
      const imageProduct = product.image;

      if (imageProduct) {
        const publicId = extractPublicId(imageProduct);
        cloudinary.uploader.destroy(publicId);
      }

      return MainModel.deleteOne({ _id: params.id });
    }
  },
  editItem: (params, option) => {
    if (option.task == "edit") {
      return MainModel.updateOne({ _id: params.id }, params.body);
    }
  },
};
