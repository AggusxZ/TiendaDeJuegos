const Product = require('../models/product.model');
const ProductDTO = require('../dtos/productDto');
const { logger } = require('../utils/logger');

class ProductDao {
  async addProduct(productData) {
    try {
      const newProduct = new Product({
        name: productData.name,
        price: productData.price,
        category: productData.category,
      });
      await newProduct.save();
      
      return newProduct; 
    } catch (error) {
      logger.error('Error al agregar el producto:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
        const products = await Product.find({}, '_id name price category');
        const productDTOs = products.map(product => new ProductDTO(product.name, product.price, product.category));
        return productDTOs;
    } catch (error) {
        logger.error('Error al obtener los productos:', error);
        return [];
    }
  } 

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      logger.error('Error al obtener el producto por ID:', error);
      return null;
    }
  }

  async updateProduct(id, updatedProductData) {
    try {
      return await Product.findByIdAndUpdate(id, updatedProductData, { new: true });
    } catch (error) {
      logger.error('Error al actualizar el producto:', error);
      throw error;
    }
  }
  
  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error al eliminar el producto:', error);
      throw error;
    }
  }

  async getSpecificProductData() {
    try {
      return await Product.find({}, '-_id name price category').lean();
    } catch (error) {
      logger.error('Error al obtener los productos:', error);
      return [];
    }
  }
}

module.exports = new ProductDao();