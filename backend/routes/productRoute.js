const express = require("express");
const router = express.Router();
const productController = require("./../controllers/productController");

// addded filterstring middleware to remove "" if there are any
router
  .route("/")
  .get(productController.filterString, productController.getAllProducts);
router
  .route("/month/:month")
  .get(productController.filterString, productController.getAllProductsByMonth);

router.route("/product-stats").get(productController.getProductsStatistics);

router.route("/category-stats").get(productController.getProductsByCategory);

router.route("/range-stats").get(productController.getProductPriceRange);

router.route("/all-stats").get(productController.fetchAllMainData);

// importing data in our DATABASE
router.route("/initialize").get(productController.initailize);

module.exports = router;
