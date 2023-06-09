const util = require("util");
const notify = require(__path_configs + "notify");

const options = {
  name: { min: 1, max: 100 },
  description: { min: 1, max: 100 },
};

module.exports = {
  validator: (req) => {
    // NAME
    req
      .checkBody(
        "name",
        util.format(notify.ERROR_NAME, options.name.min, options.name.max)
      )
      .isLength({ min: options.name.min, max: options.name.max });

    // description
    req
      .checkBody(
        "title",
        util.format(
          notify.ERROR_NAME,
          options.description.min,
          options.description.max
        )
      )
      .isLength({ min: options.description.min, max: options.description.max });

    let errors = req.validationErrors() !== false ? req.validationErrors() : [];
    let message = {};
    errors.map((val, ind) => {
      message[val.param] = val.msg;
    });

    return message;
  },
};
