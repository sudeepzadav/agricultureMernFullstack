const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const userRouter = require("./router/userRouter");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Backend is working 🚀");
});

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server Started ${PORT}`);
    connectDb();
});