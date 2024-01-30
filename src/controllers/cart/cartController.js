const cartDao = require('../../daos/cartDao');

const createCart = async (req, res) => {
  try {
   
    await cartDao.addToCart();
    return res.status(201).json({ message: 'New cart created' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCartProducts = async (req, res) => {
  try {
   
    const cartProducts = await cartDao.getCartProducts();

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

    await cartDao.addToCart(pid, cartId); 

    return res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewCart = async (req, res) => {
  try {
    const cartProducts = await cartDao.getCartProducts();

    if (cartProducts.length === 0) {
      return res.render('cart', { cart: { products: [] } }); 
    }

    return res.render('cart', { cart: { products: cartProducts } }); 
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createCart,
  getCartProducts,
  addToCart,
  viewCart, 
};

