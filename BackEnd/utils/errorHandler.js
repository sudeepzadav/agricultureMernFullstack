const errorHandler = (res, error) => {
  return res
    .status(500)
    .json({ success: false, message: "Server error", error: error.message });
};


module.exports = errorHandler;
