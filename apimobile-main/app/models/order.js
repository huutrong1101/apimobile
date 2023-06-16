const { ObjectId } = require("bson");

const MainModel = require(__path_schemas + "order");
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

    if (option.task == "all") {
      return MainModel.find(find)
        .select(select)
        .sort(sort);
    }
  },
  getItem: (params) => {
    return MainModel.find({ user: params.id });
  },

  getItemDetail: (params) => {
    return MainModel.findOne({ _id: params.id });
  },
  create: (item) => {
    return new MainModel(item).save();
  },
  deleteItem: (params, option) => {
    if (option.task == "one") {
      return MainModel.deleteOne({ _id: params.id });
    }
  },

  updateItem: async (params) => {
    const order = await MainModel.findOne({ _id: params.id });
    order.status = params.body.status;
    await order.save();

    return order;
  },
};
