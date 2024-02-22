const CartDAO = require('../daos/cartDao');

class CartRepository {
  async addToCart(productId, cartId) {
    try {
      return await CartDAO.addToCart(productId, cartId);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  }

  async getCartProducts() {
    try {
      return await CartDAO.getCartProducts();
    } catch (error) {
      console.error('Error al obtener productos del carrito:', error);
      throw error;
    }
  }

  async getCarts() {
    try {
      return await CartDAO.getCarts();
    } catch (error) {
      console.error('Error al obtener los carritos:', error);
      throw error;
    }
  }
}

module.exports = new CartRepository();

