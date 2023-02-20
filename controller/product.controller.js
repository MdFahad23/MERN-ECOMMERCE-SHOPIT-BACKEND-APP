const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../model/productModel");
const ApiFeatures = require("../utils/apiFeatures");

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

    //   Check photo
    if (files.photo) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("problem in file data!");
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
  let resultPerPage = 10;
  let productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(
    Product.find().populate("category"),
    req.query
  )
    .Search()
    .Filter()
    .pagination(resultPerPage);

  const product = await apiFeature.query;

  if (!product) return res.status(404).send("Product Not Found!");
  else
    return res.status(200).send({
      success: true,
      productCount,
      product,
    });
};

// Get All Product (Admin)
module.exports.getAdminProducts = async (req, res, next) => {
  const product = await Product.find()
    .select({ photo: 0 })
    .populate("category")
    .populate("user");

  return res.status(200).send(product);
};

// Get ProductById(admin)
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

// Update Product(admin)
module.exports.updateProduct = async (req, res) => {
  // Query Product
  let product = await Product.findById(req.params.id);
  // Create from
  let from = new formidable.IncomingForm();

  // form to parse
  from.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send(err.message);
    //   Update Fields
    let updateField = _.pick(fields, [
      "name",
      "description",
      "price",
      "category",
      "quantity",
    ]);
    updateField.user = req.user._id;
    _.assignIn(product, updateField);

    // Check Photo
    if (files.photo) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) return res.status(400).send("problem in file data!");
        product.photo.data = data;
        product.photo.contentType = files.photo.mimetype;
        product.save((err, result) => {
          if (err) return res.status(500).send("Internal Server error!");
          else
            return res
              .status(200)
              .send({ message: "Product Update Successfully!" });
        });
      });
    } else {
      product.save((err, result) => {
        if (err) return res.status(500).send("Internal Server error!");
        else
          return res
            .status(200)
            .send({ message: "Product Update Successfully!" });
      });
    }
  });
};

// Delete Product(admin)
module.exports.deleteProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Product not Found!");
  await product.remove();
  return res.status(200).send({
    success: true,
    message: "Product Delete Successfully!",
  });
};

// Create New Review or Update the review
module.exports.createProductReview = async (req, res) => {
  let { rating, comment, productId } = req.body;

  let review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  let product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if ((rev) => rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save();

  return res.status(200).send({ success: true });
};

// Get All Reviews
module.exports.getAllReviews = async (req, res) => {
  let product = await Product.findById(req.query.id);

  if (!product) return res.status(400).send("Product Not Found!");

  return res.status(200).send({
    message: true,
    reviews: product.reviews,
  });
};

// Delete Reviews
module.exports.deleteReviews = async (req, res) => {
  let product = await Product.findById(req.query.productId);

  if (!product) return res.status(400).send("Product Not Found!");

  let reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  return res.status(200).send({ message: true });
};
