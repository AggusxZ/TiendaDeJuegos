const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authorizationMiddleware');
const { updateUserRole } = require('../controllers/auth/authController'); 

router.put('/premium/:uid', isAuthenticated, updateUserRole); 

module.exports = router;

