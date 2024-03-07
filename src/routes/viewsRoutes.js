const express = require('express');
const router = express.Router();
const viewController = require('../controllers/view/viewController');
const { loggerTest } = require('../controllers/logger/loggerTestController');

router.get('/home', viewController.renderHome);
router.get('/realtimeproducts', viewController.renderRealTimeProducts);
router.get('/products', viewController.renderProducts);
router.get('/loggerTest', loggerTest);

router.get('/', (req, res) => {
    logger.info('Redireccionando a /products');
  res.redirect('/products');
});


module.exports = router;
