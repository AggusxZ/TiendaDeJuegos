const CartDAO = require('../daos/cartDao');
const { logger } = require('../utils/logger');

class CartRepository {
  async addToCart(productId, cartId) {
    try {
      return await CartDAO.addToCart(productId, cartId);
    } catch (error) {
      logger.error('Error al agregar al carrito:', error);
      throw error;
    }
  }

  async getCartProducts() {
    try {
      return await CartDAO.getCartProducts();
    } catch (error) {
      logger.error('Error al obtener productos del carrito:', error);
      throw error;
    }
  }

  async getCarts() {
    try {
      return await CartDAO.getCarts();
    } catch (error) {
      logger.error('Error al obtener los carritos:', error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      return await CartDAO.getCartById(cartId);
    } catch (error) {
      logger.error('Error al obtener el carrito por ID:', error);
      throw error;
    }
  }
}

module.exports = new CartRepository();


