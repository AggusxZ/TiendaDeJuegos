const cartRepository = require('../../repositories/cartRepository');
const Product = require('../../models/product.model');
const Ticket = require('../../models/ticket.model');

const createCart = async (req, res) => {
  try {
    await cartRepository.addToCart();
    return res.status(201).json({ message: 'New cart created' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCartProducts = async (req, res) => {
  try {
    const cartProducts = await cartRepository.getCartProducts();
    if (cartProducts.length === 0) {
      return res.status(404).json({ error: 'No products found in cart' });
    }
    return res.json(cartProducts);
  } catch (error) {
    console.error('Error fetching cart products:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { pid } = req.params;
    const { cartId } = req.body; 
    if (!cartId) {
      return res.status(400).json({ error: 'Cart ID is required' });
    }
    await cartRepository.addToCart(pid, cartId); 
    return res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewCart = async (req, res) => {
  try {
    const cartProducts = await cartRepository.getCartProducts();
    console.log('Cart Products:', JSON.stringify(cartProducts, null, 2));

    if (cartProducts.length === 0) {
      console.log('Empty cart');
      return res.render('cart', { cart: { products: [], total: 0 } }); 
    }

    let total = 0;
    cartProducts.forEach(cartDTO => {
      cartDTO.products.forEach(product => {
        total += product.price * product.quantity;
      });
    });

    return res.render('cart', { cart: { products: cartProducts, total: total } }); 
  } catch (error) {
    console.error('Error en viewCart:', error);
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
    console.error('Error purchasing cart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Función para generar un código único
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

// Función para calcular el total de la compra
function calculateTotal(cart) {
  let total = 0;
  for (const item of cart.products) {
      if (item.product && item.product.price) { 
          total += item.product.price * item.quantity;
      }
  }
  return total;
}

module.exports = {
  createCart,
  getCartProducts,
  addToCart,
  viewCart,
  purchaseCart,
};



