const productRepository = require('../../repositories/productRepository');
const errorCodes = require('../../utils/errorCodes');
const errorHandler = require('../../utils/errorHandler');
const { logger } = require('../../utils/logger');

const renderProductsView = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }

    const { limit = 10, page = 1, sort, query } = req.query;
    const products = await productRepository.getProducts();
    logger.info(products);
    let filteredProducts = [...products]; 

    if (sort === 'asc' || sort === 'desc') {
      filteredProducts.sort((a, b) => {
        if (sort === 'asc') {
          return a.price - b.price; 
        } else {
          return b.price - a.price; 
        }
      });
    }

    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + parseInt(limit, 10);
    const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

    const simplifiedProducts = paginatedProducts.map(product => ({
      name: product.name,
      price: product.price,
      category: product.category,
    }));

    const totalPages = Math.ceil(filteredProducts.length / limit);
    const hasNextPage = endIdx < filteredProducts.length;
    const hasPrevPage = page > 1;

    const response = {
      status: 'success',
      payload: simplifiedProducts,
      totalPages,
      prevPage: hasPrevPage ? +page - 1 : null,
      nextPage: hasNextPage ? +page + 1 : null,
      page: +page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${+page - 1}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${+page + 1}` : null,
    };

    logger.info(simplifiedProducts);
    res.render('products', { products: simplifiedProducts, response, user });
  } catch (error) {
    logger.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getProducts = async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  return renderProductsView(req, res);
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productRepository.getProductById(parseInt(pid, 10));

    if (!product) {
      const error = new Error('Product not found');
      error.code = errorCodes.PRODUCT_NOT_FOUND;
      throw error;
    }

    return res.json(product);
  } catch (error) {
    errorHandler.handleProductError(error, res);
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    await productRepository.addProduct(newProduct);
    return res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    errorHandler.handleProductError(error, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProductData = req.body;
    const updatedProduct = await productRepository.updateProduct(id, updatedProductData);
    return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    errorHandler.handleProductError(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productRepository.deleteProduct(id);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    errorHandler.handleProductError(error, res);
  }
};

module.exports = {
  getProducts,
  renderProductsView, 
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};

