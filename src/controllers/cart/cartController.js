const cartRepository = require('../../repositories/cartRepository');
const Product = require('../../models/product.model');
const Ticket = require('../../models/ticket.model');
const { logger } = require('../../utils/logger');


const createCart = async (req, res) => {
  try {
    const productId = req.body.productId || null;
    const newCart = await cartRepository.addToCart(productId);
    return res.status(201).json({ message: 'New cart created', cartId: newCart._id }); 
  } catch (error) {
    logger.error('Error creating cart:', error); 
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCartProducts = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const cartProducts = await cartRepository.getCartProducts(cartId); 

    if (!cartProducts) {
      return res.status(404).json({ error: 'No products found in cart' });
    }
    return res.json(cartProducts);
  } catch (error) {
    logger.error('Error fetching cart products:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    if (!cid) {
      return res.status(400).json({ error: 'Cart ID is required' });
    }

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.user.role === 'premium' && product.owner === req.user.email) {
      return res.status(403).json({ error: 'Premium users cannot add their own products to the cart' });
    }

    await cartRepository.addToCart(pid, cid);

    return res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error in addToCart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewCart = async (req, res) => {
  try {
    const cartId = req.params.cartId; 
    const cartProductsDTO = await cartRepository.getCartProducts(cartId);
    logger.info('Cart Products:', JSON.stringify(cartProductsDTO, null, 2));

    if (!cartProductsDTO) {
      logger.info('No products found in cart');
      return res.render('cart', { cart: { products: [], total: 0 } });
    }

    let total = 0;
    if (!Array.isArray(cartProductsDTO.cartProducts)) {
      logger.error('Cart products is not an array:', cartProductsDTO.cartProducts);
      return res.status(500).json({ error: 'Invalid cart products' });
    }

    cartProductsDTO.cartProducts.forEach(product => {
      total += product.price * product.quantity;
    });

    return res.render('cart', { cart: { products: cartProductsDTO.cartProducts, total: total } });
  } catch (error) {
    logger.error('Error en viewCart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Verificar si cart.products está definido
    if (!cart.products) {
      return res.status(400).json({ error: 'Cart products not found' });
    }

    let productsNotPurchased = [];
    // Verificar el stock y actualizar el stock del producto
    for (const item of cart.products) {
      if (!item.productId) {
        return res.status(400).json({ error: 'Product not found in cart' });
      }

      const product = item.productId;
      const quantityInCart = item.quantity;
      if (product.stock < quantityInCart) {
        productsNotPurchased.push(product._id);
      } else {
        product.stock -= quantityInCart;
        await product.save();
      }
    }
    // Crear un nuevo ticket para la compra
    const ticket = new Ticket({
      code: generateUniqueCode(), 
      purchase_datetime: new Date(),
      amount: calculateTotal(cart.products), 
      purchaser: req.user.email,
    });
    await ticket.save();
    // Si hay productos que no se pudieron comprar, dejarlos en el carrito
    if (productsNotPurchased.length > 0) {
      cart.products = cart.products.filter(item => !productsNotPurchased.includes(item.product._id));
      await cart.save();
    }
    return res.status(200).json({ message: 'Purchase completed successfully', productsNotPurchased });
  } catch (error) {
    logger.error('Error purchasing cart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 8;
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

function calculateTotal(products) {
  let total = 0;
  products.forEach(product => {
    total += product.price * product.quantity;
  });
  return total;
}

module.exports = {
  createCart,
  getCartProducts,
  addToCart,
  viewCart,
  purchaseCart,
};




