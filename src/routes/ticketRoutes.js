const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart/cartController');

router.get('/:ticketId', cartController.viewTicket);

module.exports = router;