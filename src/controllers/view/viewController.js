const productDao = require('../../daos/productDao');
const { logger } = require('../../utils/logger');

const renderHome = async (req, res) => {
  try {
    const products = await productDao.getSpecificProductData();
    logger.info('Productos para la vista home:', products);

    res.render('home', { products });  
  } catch (error) {
    logger.error('Error al obtener productos:', error);
    res.render('error', { error: 'Error al obtener los productos' });
  }
};

const renderRealTimeProducts = async (req, res) => {
  try {
    const products = await productDao.getProducts();
    logger.info('Productos para la vista realTimeProducts:', products);
    res.render('realTimeProducts', { products }); 
  } catch (error) {
    logger.error('Error al obtener productos:', error);
    res.render('error', { error: 'Error al obtener los productos' });
  }
};

const renderProducts = async (req, res) => {
  try {
    const products = await productDao.getProducts(); 
    logger.info('Productos para la vista products:', products);
    res.render('products', { products }); 
  } catch (error) {
    logger.error('Error al obtener productos:', error);
    res.render('error', { error: 'Error al obtener los productos' });
  }
};

module.exports = {
  renderHome,
  renderRealTimeProducts,
  renderProducts,
};
