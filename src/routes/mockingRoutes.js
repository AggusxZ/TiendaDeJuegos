const { Router } = require('express');
const generateProduct = require('../utils/utils');
const { logger } = require('../utils/logger');

const router = Router();

router.get('/mockingproducts', (req, res) => {
    try {
      const mockProducts = Array.from({ length: 100 }, generateProduct);
      res.json({ products: mockProducts });
    } catch (error) {
      logger.error('Error al generar productos simulados:', error);
      res.status(500).json({ error: 'Error interno del servidor al generar productos simulados' });
    }
  });

module.exports = router;




