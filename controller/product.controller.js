const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../model/productModel");

// Create Product
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
        product.photo.data = data;
        product.photo.contentType = files.photo.type;
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
