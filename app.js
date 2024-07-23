const express = require("express");
const connectDB = require("./db");
const authRouter = require("./routes/auth.route");
require("dotenv").config();

const app = express();

connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello this is from tms api");
});

app.use("/api", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`app running on port ${process.env.PORT}`);
});
