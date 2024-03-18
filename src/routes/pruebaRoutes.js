const { Router } = require('express')
const { email } = require('../utils/email')

const router = Router()

router.get('/email', (req, res) => {
    email('tiendadejuegosjs@gmail.com', 'email de prueba', '<h1>Bienvenido</h1>')
    res.send('Email enviado')
})

module.exports = router