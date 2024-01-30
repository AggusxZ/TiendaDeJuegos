const productDao = require('../../daos/productDao');

const renderHome = async (req, res) => {
  try {
    const products = await productDao.getSpecificProductData();
    console.log('Productos para la vista home:', products);

    res.render('home', { products });  
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('error', { error: 'Error al obtener los productos' });
  }
};

const renderRealTimeProducts = async (req, res) => {
  try {
    const products = await productDao.getProducts();
    console.log('Productos para la vista realTimeProducts:', products);
    res.render('realTimeProducts', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('error', { error: 'Error al obtener los productos' });
  }
};

const renderProducts = async (req, res) => {
  try {
    const products = await productDao.getProducts(); 
    console.log('Productos para la vista products:', products);
    res.render('products', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('error', { error: 'Error al obtener los productos' });
  }
};

module.exports = {
  renderHome,
  renderRealTimeProducts,
  renderProducts,
};
