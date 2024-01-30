const Product = require('../models/product.model');

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
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await Product.find({}, '_id name price category');
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      return null;
    }
  }

  async updateProduct(id, updatedProductData) {
    try {
      return await Product.findByIdAndUpdate(id, updatedProductData, { new: true });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }
  
  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    }
  }

  async getSpecificProductData() {
    try {
      return await Product.find({}, '-_id name price category').lean();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }
}

module.exports = new ProductDao();