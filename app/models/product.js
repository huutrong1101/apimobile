const MainModel = require(__path_schemas + "product");
const cloudinary = require("cloudinary").v2;
const { extractPublicId } = require("cloudinary-build-url");

module.exports = {
  listItems: (params, option) => {
    // coppy params
    const queryFind = { ...params };

    let find, select, sort;

    // Create fields remove
    let removeFields = ["select", "sort", "page", "limit"];

    // Remove fields
    removeFields.forEach((param) => delete queryFind[param]);

    // Create query string
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

    if (option.task == "all") {
      return MainModel.find(find).select(select).sort(sort);
    }
    if (option.task == "one") {
      return MainModel.findById(params.id).select({});
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
  event: async (params, option) => {
    let number = 1;
    let type = params.type;
    if (type != "like" && type != "dislike") return;
    if (type == "dislike") {
      type = "like";
      number = -1;
    }
    return MainModel.findByIdAndUpdate(
      params.id,
      { $inc: { [type]: number } },
      { new: true }
    );
  },
};
