const CartDAO = require('../daos/cartDao');
const { logger } = require('../utils/logger');
const Cart = require('../models/cart.model');

class CartRepository {
  
  async createCart(userId) {
    try {
      const newCart = new Cart({
        owner: userId, 
        products: []
      });
  
      const savedCart = await newCart.save();
  
      return savedCart;
    } catch (error) {
      logger.error('Error creating cart:', error);
      throw error;
    }
  }

  async addToCart(productId, cartId, userId) {
    try {
      // Obtener el carrito por su ID
      const cart = await this.getCartById(cartId);

      // Verificar si se obtuvo un carrito válido
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Verificar si el carrito tiene la propiedad 'owner' antes de acceder a ella
      if (cart.owner && !cart.owner.equals(userId)) {
        throw new Error('Forbidden: Cart does not belong to the user');
      }

      // Llamar a la función addToCart del DAO
      const updatedCart = await CartDAO.addToCart(productId, cartId);

      return updatedCart;
    } catch (error) {
      logger.error('Error adding to cart:', error);
      throw error;
    }
  }

  async getCartProducts(cartId) {
    try {
      const cartProducts = await CartDAO.getCartProducts(cartId);
      return cartProducts;
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






