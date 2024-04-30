const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Redireccionando a /products');
  res.redirect('/products');
});

module.exports = router;
