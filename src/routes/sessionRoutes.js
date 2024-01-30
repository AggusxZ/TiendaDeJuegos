const express = require('express');
const router = express.Router();

router.get('/current', (req, res) => {
    console.log('Ruta /current accedida');
    console.log('Estado de autenticación:', req.isAuthenticated());
    console.log('Usuario autenticado:', req.user);

    if (req.isAuthenticated()) {
        const { email, role } = req.user;
        const userInfo = { email, role };
        res.json({ user: userInfo });
    } else {
        res.status(401).json({ error: 'No hay usuario autenticado' });
    }
});

module.exports = router;
