if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} 


const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport');
const path = require('path');
const flash = require('express-flash');
//const flash = require('connect-flash');

//bbdd
require('./database');


//const MONGO_URL = 'mongodb://127.0.0.1:27017/twitter-clone';
const app = express();

//mongoose.Promise = global.Promise;
//mongoose.connect(MONGO_URL);
//mongoose.connection.on('error', (err) => {
//  throw err;
//  process.exit(1);
//})

//app.use(session({
 // secret: 'ESTO ES SECRETO',
//  resave: true,
 // saveUninitialized: true,
 // store: new MongoStore({
    //url: MONGODB_URI,
  //  autoReconnect: true
 // })
//}))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//app.use(function(req, res, next){
//  res.locals.session = req.session;
//  next();
//})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(path.join(__dirname, 'vistas')));

app.set('views', path.join(__dirname, 'vistas'));
app.set('view engine', 'pug');

app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

const controladorHome = require('./controladores/home');
app.get('/', controladorHome.getHome);

const controladorPerfil = require('./controladores/perfil');
app.get('/mi/perfil', passportConfig.estaAutenticado, controladorPerfil.getMiPerfil);
app.get('/perfil/:id', controladorPerfil.getPerfil);
app.get('/seguir/:id', passportConfig.estaAutenticado, controladorPerfil.seguir);
app.get('/unseguir/:id', passportConfig.estaAutenticado, controladorPerfil.unseguir);

const controladorUsuario = require('./controladores/usuario');
app.get('/login', controladorUsuario.getLogin);
app.get('/signup', controladorUsuario.getSignup);
app.post('/signup', controladorUsuario.postSignup);
app.post('/login', controladorUsuario.postLogin);
app.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout);

const controladorTweets = require('./controladores/tweet');
app.post('/tweet', passportConfig.estaAutenticado, controladorTweets.postTweet);

app.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) => {
  res.json(req.user);
})

const controladorExplorar = require('./controladores/explorar');
app.get('/explorar', controladorExplorar.getExplorar);
app.post('/explorar', controladorExplorar.postExplorar);

app.listen(3000, () => {
  console.log('Server on port 3000');
})