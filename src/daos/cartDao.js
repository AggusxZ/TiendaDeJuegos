const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const uuid = require('uuid')

const addToCart = async (productId, cartId) => {
  try {
    console.log('ID del producto recibido:', productId);
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = new Cart({ 
        cartId: uuid.v4(), 
        products: [] 
      });
    }

    if (productId) {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('El producto no existe');
      }

      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId: product._id, quantity: 1 });
      }
    }

    await cart.save();
    
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    throw error;
  }
};

const getCartProducts = async () => {
  try {
    
    const allCarts = await Cart.find({});
    const productIds = allCarts.flatMap(cart => cart.products.map(product => product.productId));
    const cartProducts = await Product.find({ _id: { $in: productIds } });
    
    return cartProducts;
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    throw error;
  }
};

const getCarts = async () => {
  try {
    return await Cart.find({});
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    return [];
  }
};

module.exports = {
  addToCart,
  getCartProducts,
  getCarts
};
