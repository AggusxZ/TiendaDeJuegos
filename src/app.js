const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const { connectDB, configApp } = require('./config/config');
const configurePassport = require('./config/passportConfig');
const MongoStore = require('connect-mongo');
const { addLogger } = require('./utils/logger');
const { logger } = require('./utils/logger');

const productsRouter = require('./routes/productsRoutes');
const cartsRouter = require('./routes/cartsRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const authRouter = require('./routes/authRoutes');
const sessionRouter = require('./routes/sessionRoutes');
const chatRouter = require('./routes/chatRoutes');
const mockingRouter = require('./routes/mockingRoutes');
const pruebaRouter = require('./routes/pruebaRoutes')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const app = express();
const PORT = configApp.port;

connectDB();

configurePassport();

app.use(addLogger);

const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación de Tienda de Juegos',
          description: 'Api Docs para Tienda de Juegos'
      }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Session con Mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://AggusxZ:oEirPMQPY7HUfo2k@cluster0.46mdk2n.mongodb.net/tiendadejuegos',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 900000,
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configuración de Handlebars
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, '../views'),
  extname: 'handlebars',
  defaultLayout: undefined,
  helpers: {
    ifEqual: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
    multiply: function(a, b) {
      return a * b;
    }
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/api', sessionRouter);
app.use('/chat', chatRouter);
app.use('/', viewsRouter);
app.use('/', mockingRouter);
app.use('/pruebas', pruebaRouter)

// Redirección a /auth/login cuando se accede a la ruta principal
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Creación del servidor HTTP
const server = http.createServer(app);
const io = socketIO(server);

// Manejo de WebSockets
io.on('connection', (socket) => {
  logger.info('Nuevo cliente conectado');
});

// Iniciar el servidor
server.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});


