const ProductDAO = require('../daos/productDao');
const { logger } = require('../utils/logger');

class ProductRepository {
  async addProduct(productData) {
    try {
      return await ProductDAO.addProduct(productData);
    } catch (error) {
      logger.error('Error al agregar el producto:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await ProductDAO.getProducts();
    } catch (error) {
      logger.error('Error al obtener los productos:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await ProductDAO.getProductById(id);
    } catch (error) {
      logger.error('Error al obtener el producto por ID:', error);
      throw error;
    }
  }

  async updateProduct(id, updatedProductData) {
    try {
      return await ProductDAO.updateProduct(id, updatedProductData);
    } catch (error) {
      logger.error('Error al actualizar el producto:', error);
      throw error;
    }
  }
  
  async deleteProduct(id) {
    try {
      return await ProductDAO.deleteProduct(id);
    } catch (error) {
      logger.error('Error al eliminar el producto:', error);
      throw error;
    }
  }
}

module.exports = new ProductRepository();

