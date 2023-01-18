require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE_URL)
  .then((res) => console.log("SUCCESSFULLY TO CONNECTING DATABASE!"))
  .catch((err) => console.log("DATABASE CONNECTING FAILED!"));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port} `);
});
