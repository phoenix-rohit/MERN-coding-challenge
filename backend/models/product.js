const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A product must have a name"],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

// productSchema.post("aggregate", function (next) {
//   this.pipeline().unshift({
//     $match: {
//       $expr: {
//         $eq: [{ $month: "$dateOfSale" }],
//       },
//     },
//   });

//   next();
// });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
