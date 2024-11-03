const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const { default: mongoose } = require("mongoose");

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log(`Local DB CONNECTED`);
});

const port = 7000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
