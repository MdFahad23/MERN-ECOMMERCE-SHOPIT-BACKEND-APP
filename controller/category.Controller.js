const _ = require("lodash");
const { Category, validate } = require("../model/categoryModel");

// Create Category(admin)
module.exports.createCategory = async (req, res) => {
  let { error } = validate(_.pick(req.body, ["name"]));
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category(_.pick(req.body, ["name"]));
  const result = await category.save();

  return res.status(201).send({
    message: "Category created successfully!",
    data: {
      name: result.name,
    },
  });
};

// Get Category
module.exports.getCategorise = async (req, res) => {
  const categorise = await Category.find().sort({ name: -1 });
  return res.status(200).send(categorise);
};
