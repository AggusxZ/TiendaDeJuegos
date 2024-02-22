const express = require('express');
const router = express.Router();
const { isUser } = require('../middlewares/authorizationMiddleware');


router.get('/', isUser, (req, res) => {
    res.render('chat');
});


module.exports = router;
