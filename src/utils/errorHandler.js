const errorCodes = require('./errorCodes');

const handleProductError = (error, res) => {
  switch (error.code) {
    case errorCodes.PRODUCT_NOT_FOUND:
      return res.status(404).json({ error: 'Product not found' });
    case errorCodes.ADD_PRODUCT_ERROR:
      return res.status(500).json({ error: 'Error adding product' });
    case errorCodes.UPDATE_PRODUCT_ERROR:
      return res.status(500).json({ error: 'Error updating product' });
    case errorCodes.DELETE_PRODUCT_ERROR:
      return res.status(500).json({ error: 'Error deleting product' });
    default:
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  handleProductError,
};

