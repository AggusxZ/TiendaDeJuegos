const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const CartDTO = require('../dtos/cartDto');
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const addToCart = async (productId, cartId) => {
  try {
    logger.debug('ID del producto recibido:', productId);

    let cart;
    if (cartId) {
      cart = await Cart.findOne({ _id: new mongoose.Types.ObjectId(cartId) });
    }

    if (!cart) {
      cart = new Cart({ 
        products: [] 
      });
    }

    if (productId) {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ 
          productId: product._id, 
          quantity: 1, 
          price: product.price
        });
      }
    }

    await cart.save();
    
    return cart; 

  } catch (error) {
    logger.error('Error al agregar al carrito:', error);
    throw error;
  }
};

const getCartById = async (cartId) => {
  try {
    const cart = await Cart.findOne({ _id: cartId }).populate('products.productId');
    return cart;
  } catch (error) {
    logger.error('Error al obtener el carrito por ID:', error);
    throw error;
  }
};

const getCartProducts = async (cartId) => {
  try {
    const cart = await Cart.findOne({ _id: cartId }).populate('products.productId');
    
    if (!cart) {
      throw new Error('No se encontró el carrito');
    }

    const cartProducts = cart.products.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity
    }));

    const cartDTO = new CartDTO(cart._id, cartProducts);

    return cartDTO; 
  } catch (error) {
    logger.error('Error al obtener productos del carrito:', error);
    throw error;
  }
};

const getCarts = async () => {
  try {
    return await Cart.find({});
  } catch (error) {
    logger.error('Error al obtener los carritos:', error);
    return [];
  }
};

module.exports = {
  addToCart,
  getCartById,
  getCartProducts,
  getCarts
};



