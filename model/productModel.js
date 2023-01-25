const { Schema, model } = require("mongoose");
const joi = require("joi");

module.exports.Product = model(
  "Product",
  Schema(
    {
      name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      photo: {
        data: Buffer,
        contentType: String,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      ratings: {
        type: Number,
        default: 0,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports.validate = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).max(255).required(),
    description: joi.string().max(2000).required(),
    price: joi.number().required(),
    category: joi.string().required(),
    quantity: joi.number().required(),
  });
  return schema.validate(product);
};
