const { query } = require("express");
const Product = require("../models/product");

// TASK 1 COMPLETE DONE "GET"
/* ADDED DATA TO THE DATABASE */
exports.initailize = async (req, res, next) => {
  const resp = await fetch(
    "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
  );
  const products = await resp.json();

  if (!products) {
    return res.status(404).json({
      status: "failed",
    });
  }
  // clear all
  await Product.deleteMany();

  // add all products
  const newProducts = await Product.create(products);

  return res.status(200).json({
    status: "success",
    results: newProducts.length,
    data: {
      newProducts,
    },
  });
};

// TASK 2 "GET" DONE
// IMPLETMENT
// Search based on text for title,price,description
// Pagination if values page = 1 and per page = 10
exports.filterString = (req, res, next) => {
  if (req.query?.title?.startsWith(`"`)) {
    req.query.title = req.query.title.replaceAll(/"/g, "");
  }
  if (req.query?.description?.startsWith(`"`)) {
    req.query.description = req.query.description.replaceAll(/"/g, "");
  }

  next();
};

exports.getAllProductsByMonth = async (req, res, next) => {
  // let queryObj = { ...req.query };
  // const excludedFields = [, "sort", "fields"];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // // { price: { lt: '329.85' } }
  // // { price: { $lt: '329.85' } }
  // // to add $ in front of gt/gte/lt/lte
  // queryObj = JSON.parse(
  //   JSON.stringify(queryObj).replace(
  //     /\b(gte|gt|lt|lte)\b/g,
  //     (match) => `$${match}`
  //   )
  // );

  // const month = req.query.month * 1;
  const month = req.params.month * 1;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  // const fields = {...req.query.fields}.split(',').join(' ') || ;

  let query = Product.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, month],
        },
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);
  // // sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // }

  // // limiting fields
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v");
  // }

  const products = await query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
};
exports.getAllProducts = async (req, res, next) => {
  let queryObj = { ...req.query };
  const excludedFields = ["page", "limit", "sort", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // { price: { lt: '329.85' } }
  // { price: { $lt: '329.85' } }
  // to add $ in front of gt/gte/lt/lte

  queryObj = JSON.parse(
    JSON.stringify(queryObj).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    )
  );

  let query = Product.find(queryObj);

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  // limiting fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const products = await query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
};

// TASK 3 "GET" DONE
// IMPLETMENT
// Create an Api for statisticss
// 1. Total sale amount of selected month
// 2. TOtal number of sold items of selected month
// 3. Total nuber of not sold items of selected month
// Use match month and aggregation pipleline here
exports.getProductsStatistics = async (req, res, next) => {
  try {
    const month = req.query.month * 1;

    const productStats = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      // $cond if used to set conditions // IMPNOTEREVISETHEORY
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: {
            $sum: {
              $cond: { if: { $eq: ["$sold", true] }, then: 1, else: 0 },
            },
          },
          totalUnsoldItems: {
            $sum: {
              $cond: { if: { $eq: ["$sold", false] }, then: 1, else: 0 },
            },
          },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        productStats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: null,
    });
  }
};

// TASK 4 "GET"
// IMPLETMENT
// Create an API for bar chart ( the response should contain price range and the number of items in that range for the selected month regardless of the year )
// 0-100,101-200 ,....,901-above

exports.getProductPriceRange = async (req, res, next) => {
  try {
    const month = req.query.month * 1;

    const rangeStats = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },

      {
        $group: {
          _id: null,

          "0-100": {
            $sum: {
              $cond: [
                { $and: [{ $gte: ["$price", 0] }, { $lte: ["$price", 100] }] },
                1,
                0,
              ],
            },
          },
          "101-200": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 101] }, { $lte: ["$price", 200] }],
                },
                1,
                0,
              ],
            },
          },
          "201-300": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 201] }, { $lte: ["$price", 300] }],
                },
                1,
                0,
              ],
            },
          },
          "301-400": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 301] }, { $lte: ["$price", 400] }],
                },
                1,
                0,
              ],
            },
          },
          "401-500": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 401] }, { $lte: ["$price", 500] }],
                },
                1,
                0,
              ],
            },
          },
          "501-600": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 501] }, { $lte: ["$price", 600] }],
                },
                1,
                0,
              ],
            },
          },
          "601-700": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 601] }, { $lte: ["$price", 700] }],
                },
                1,
                0,
              ],
            },
          },
          "701-800": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 701] }, { $lte: ["$price", 800] }],
                },
                1,
                0,
              ],
            },
          },
          "801-900": {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ["$price", 801] }, { $lte: ["$price", 900] }],
                },
                1,
                0,
              ],
            },
          },
          "901-10000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$price", 901] },
                    { $lte: ["$price", 10000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        rangeStats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: null,
    });
  }
};

// TASK 5 "GET" DONE
// IMPLETMENT
// Create an API for pie chart Find unique categories and number of items from that category for the selected month regardless of the year.
// For example :
// - X category : 20 (items)
// - Y category : 5 (items)
// - Z category : 3 (items)

exports.getProductsByCategory = async (req, res, next) => {
  try {
    // const products = await Product.aggregate([
    //   {
    //     $group: {
    //       _id: "$category",
    //       numOfItems: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $addFields: { category: "$_id" },
    //   },
    //   {
    //     $project: { _id: 0 },
    //   },
    // ]);

    const month = req.query.month * 1;
    const categoryStats = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          items: { $sum: 1 },
        },
      },
      {
        $addFields: { category: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        categoryStats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: null,
    });
  }
};

// TASK 6 "GET" DONE
// IMPLETMENT
// Create an API which fetches the data from all the 3 APIs mentioned above, combines the response and sends a final response of the combined JSON

exports.fetchAllMainData = async (req, res, next) => {
  try {
    if (!req.query.month) {
      return next(`Please Select a Month`);
    }

    const myUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/`;
    const month = req.query.month * 1;

    // product-stats
    const resP = await fetch(`${myUrl}product-stats?month=${month}`);
    const dataP = await resP.json();
    // category-stats
    const resC = await fetch(`${myUrl}category-stats?month=${month}`);
    const dataC = await resC.json();
    // range-stats
    const resR = await fetch(`${myUrl}range-stats?month=${month}`);
    const dataR = await resR.json();

    const productStats = dataP.data.productStats[0];
    const categoryStats = dataC.data.categoryStats;
    const rangeStats = dataR.data.rangeStats[0];

    const allStats = [productStats, categoryStats, rangeStats];
    res.status(200).json({
      status: "success",
      data: {
        allStats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
    });
  }
};
