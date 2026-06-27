const Products = require("../model/productSchema");
const errorHandler = require("../utils/errorHandler");

async function addProduct(req, res) {
  try {
    const {
      title,
      description,
      price,
      stock,
      category,
      location,
      unit,
    } = req.body;

    // 1. Validate required fields
    if (!title || !description || !price || !stock || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // 2. Role check
    if (!req.user || req.user.role !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can add products",
      });
    }

    // 3. Handle uploaded image (Multer)
    const image = req.file ? req.file.filename : null;

    // 4. Create product
    const product = await Products.create({
      title,
      description,
      price,
      stock,
      image, // ✅ FIXED (was images from body)
      category,
      location,
      unit: unit || "kg",
      farmer: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    return errorHandler(res, error);
  }
}

async function getProducts(req, res) {
  try {
    const products = await Products.find();
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Products Not FOund" });
    }

    return res
      .status(201)
      .json({ success: true, message: "Products fetched successfull", products });
  } catch (error) {
    return errorHandler(res, error);
  }
}

async function getProductsById(req, res) {
  try {
    const { id } = req.params;

    const products = product(id);

    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    return res
      .status(201)
      .json({ success: true, message: "Product fetched successfull" });
  } catch (error) {
    return errorHandler(res, error);
  }
}

async function updateProductsById(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    return res
      .status(201)
      .json({ success: true, message: "Product updated successfull" });
  } catch (error) {
    return errorHandler(res, error);
  }
}

async function deleteProducts(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "product deleted successfull" });
  } catch (error) {
    return errorHandler(res, error);
  }
}

module.exports = {
  addProduct,
  getProducts,
  getProductsById,
  updateProductsById,
  deleteProducts
};
