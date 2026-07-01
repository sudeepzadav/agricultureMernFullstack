const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const connectDb = require("./config/connectDb");
const userRouter = require("./router/userRouter");
const productRouter = require("./router/ProductRouter");
const cartRouter = require("./router/cartRouter");
const cloudinaryConfig = require("./config/cloudinaryConfig");


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Backend is working 🚀");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);

app.listen(PORT, () => {
    console.log(`Server Started ${PORT}`);
    connectDb();
    cloudinaryConfig()
});