const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const configurePassport = require('./config/passportConfig');
const MongoStore = require('connect-mongo');

const productsRouter = require('./routes/productsRoutes');
const cartsRouter = require('./routes/cartsRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const authRouter = require('./routes/authRoutes');
const sessionRouter = require('./routes/sessionRoutes');
const chatRoutes = require('./routes/chatRoutes');

const connectDB = require('./config/db');

const app = express();
const PORT = 8080;

connectDB();

configurePassport();

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
app.use('/api/carts', cartsRouter);
app.use('/api', sessionRouter);
app.use('/chat', chatRoutes);
app.use('/', viewsRouter);

// Redirección a /auth/login cuando se accede a la ruta principal
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Creación del servidor HTTP
const server = http.createServer(app);
const io = socketIO(server);

// Manejo de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


