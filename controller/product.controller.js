const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../model/productModel");

// Create Product(admin)
module.exports.createProduct = async (req, res) => {
  // Create from
  let from = new formidable.IncomingForm();

  // form to parse
  from.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send(err.message);
    // Validate for joi
    const { error } = validate(
      _.pick(fields, ["name", "description", "price", "category", "quantity"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    fields.user = req.user._id;

    //   Create new Product
    let product = new Product(fields);

    //   Cake this photo
    if (files.photo) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("problem in file data!");
        console.log(files);
        product.photo.data = data;
        product.photo.contentType = files.photo.mimetype;
        product.save((err, result) => {
          if (err) return res.status(500).send("Internal Server error!");
          else
            return res.status(201).send({
              message: "Product create Successfully",
              data: _.pick(fields, [
                "name",
                "description",
                "price",
                "category",
                "quantity",
                "user",
                "ratings",
                "numOfReviews",
              ]),
            });
        });
      });
    } else {
      return res.status(400).send("No image Provide!");
    }
  });
};

// Get all Product
module.exports.getProducts = async (req, res) => {
  // Get Product Query String
  let order = req.query.order === "desc" ? -1 : 1;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;

  // Get Product
  const product = await Product.find()
    .select({ photo: 0 })
    .sort({ [sortBy]: order })
    .limit(limit)
    .populate("category")
    .populate("user");
  if (!product) return res.status(404).send("Product Not Found!");
  else return res.status(200).send(product);
};

// Get ProductById
module.exports.getProductById = async (req, res) => {
  let productId = req.params.id;
  const product = await Product.findById(productId)
    .select({ photo: 0 })
    .populate("category")
    .populate("user");
  if (!product) return res.status(404).send("Product Not Found!");
  else return res.status(200).send(product);
};

// Get Product Image
module.exports.getPhoto = async (req, res) => {
  let productId = req.params.id;
  const product = await Product.findById(productId).select({
    photo: 1,
    _id: 0,
  });
  res.set("Content-Type", product.photo.contentType);
  if (!product) return res.status(404).send("Product Image Not Found!");
  else return res.status(200).send(product.photo.data);
};
