const express = require("express");
const connectDB = require("./db");
const authRouter = require("./routes/auth.route");
require("dotenv").config();

const app = express();

connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Task Management System API</h1>
    <p>1. Registration page: <a href="/api/auth/register">/api/auth/register</a></p>
    <p>2. Login page: <a href="/api/auth/login">/api/auth/login</a></p>
  `);
});

app.use("/api", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`app running on port ${process.env.PORT}`);
});
