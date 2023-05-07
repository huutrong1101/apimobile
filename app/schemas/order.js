const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    },
  ],
  shippingAddress: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model(databaseConfig.col_order, orderSchema);
