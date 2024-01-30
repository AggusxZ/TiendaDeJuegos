const express = require('express');
const router = express.Router();
const viewController = require('../controllers/view/viewController');

router.get('/home', viewController.renderHome);
router.get('/realtimeproducts', viewController.renderRealTimeProducts);

router.get('/products', viewController.renderProducts);

router.get('/', (req, res) => {
    console.log('Redireccionando a /products');
  res.redirect('/products');
});

module.exports = router;
