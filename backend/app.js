const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const productRouter = require("./routes/productRoute");

// CREATE EXPRESS Application
const app = express();

// MIDDLEWARES (🟦)
// 🟦 SET Security HTTP Headers
app.use(helmet());

// 🟦 WILL ONLY ALLOW 100 Requests for same IP in an HOUR
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "TOO many Requests from this IP, Please try again in an hour",
});
// will apply to url which starts with "/api"
app.use("/api", limiter);

// 🟦 DATA Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 🟦 DATA Sanitization against XSS
app.use(xss());

// 🟦 Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ["price", "category", "title", "description"],
  })
);
app.use(cors());

// 🟦 ROUTE MIDDLEWARE BASE URL
app.use("/api/v1/products", productRouter);

// 🟦 CATCH ROUTES WHICH ARE NOT IMPLEMENTED
app.all("/*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route is not implemented",
  });
});

// 🟩🟨🟦⬜ ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  res.status(400).json({
    status: "fail",
    message: err,
  });
});

module.exports = app;
