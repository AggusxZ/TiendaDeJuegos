const productRepository = require('../../repositories/productRepository');
const errorCodes = require('../../utils/errorCodes');
const errorHandler = require('../../utils/errorHandler');
const { logger } = require('../../utils/logger');

const renderProductsView = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect('/auth/login');
    }

    const cartId = user.cart;

   /*  logger.info('Usuario autenticado:', user); */

    const { limit = 10, page = 1, sort, query, format } = req.query;
    const products = await productRepository.getProducts();
    /* logger.info('Productos obtenidos:', products); */
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
      _id: product._id,
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

    if (format === 'json') {
      return res.json(response);
    } else {
      return res.render('products', { products: simplifiedProducts, response, user, cartId });
    }
  } catch (error) {
    logger.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/auth/login');
    }

    return await renderProductsView(req, res);
  } catch (error) {
    logger.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;

    if (isNaN(parseInt(pid, 10))) {
      throw new Error('Invalid product ID');
    }

    const product = await productRepository.getProductById(pid);

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
    const { name, category, price } = req.body;

    const owner = req.user && req.user.premium ? req.user.email : 'admin';

    const newProduct = {
      name,
      category,
      price,
      owner
    };

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

    // Verificar si el ID tiene el formato correcto de ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    logger.info("ID del producto:", id);
    logger.info("Datos actualizados del producto:", updatedProductData);

    const updatedProduct = await productRepository.updateProduct(id, updatedProductData);
    return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    errorHandler.handleProductError(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productRepository.getProductById(id);

    if (req.user && req.user.role === 'admin') { 
      await productRepository.deleteProduct(id);
      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    return res.status(403).json({ error: 'Unauthorized' });
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

