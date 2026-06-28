const Products = require("../model/productSchema");
const errorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

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

    if (!title || !description || !price || !stock || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!req.user || req.user.role !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can add products",
      });
    }

    let imageUrl = null;
    let imagePublicId = null;

    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;

      
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Failed to delete local file:", err);
      });
    }

    const product = await Products.create({
      title,
      description,
      price,
      stock,
      images: imageUrl,
      category,
      location,
      unit: unit || "kg",
      farmer: req.user.id,
      cloudinary_id: imagePublicId, 
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

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,          // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
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
