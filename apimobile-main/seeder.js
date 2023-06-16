const fs = require("fs");
const mongoose = require("mongoose");
var colors = require("colors");

const pathConfig = require("./path");
global.__base = __dirname + "/";
global.__path_app = __base + pathConfig.folder_app + "/";

global.__path_configs = __path_app + pathConfig.folder_configs + "/";

const databaseConfig = require(__path_configs + "database");

mongoose.connect(
  "mongodb+srv://huutrong1101:123@cluster0.zmhvy1t.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const ProductSchemas = require("./app/schemas/product");
const CategorySchemas = require("./app/schemas/category");
const UserSchemas = require("./app/schemas/user");
const OrderSchemas = require("./app/schemas/order");
const CartSchemas = require("./app/schemas/cart");

const Product = JSON.parse(
  fs.readFileSync(`${__dirname}/app/_data/product.json`, "utf-8")
);
const Category = JSON.parse(
  fs.readFileSync(`${__dirname}/app/_data/category.json`, "utf-8")
);
const Users = JSON.parse(
  fs.readFileSync(`${__dirname}/app/_data/user.json`, "utf-8")
);
const Orders = JSON.parse(
  fs.readFileSync(`${__dirname}/app/_data/order.json`, "utf-8")
);
const Carts = JSON.parse(
  fs.readFileSync(`${__dirname}/app/_data/cart.json`, "utf-8")
);

const importData = async () => {
  try {
    await CategorySchemas.create(Category);
    await ProductSchemas.create(Product);
    await UserSchemas.create(Users);
    await OrderSchemas.create(Orders);
    await CartSchemas.create(Carts);
    console.log("importData...".bgCyan);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await CategorySchemas.deleteMany({});
    await ProductSchemas.deleteMany({});
    await UserSchemas.deleteMany({});
    await OrderSchemas.deleteMany({});
    await CartSchemas.deleteMany({});
    console.log("deleteData...".bgCyan);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
