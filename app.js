const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const csrf = require('csurf')();
const flash = require('connect-flash');
require('dotenv').config();
//const handleBars = require('express-handlebars');

const app = express();
const sessionStore = new MongoStore({url: process.env.API_URL, collection: 'sessionz'});

const errorController = require('./controllers/errors');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// const { mongoConnect } = require('./util/database');
const User = require('./models/user');
// app.engine('hbs', handleBars({
//     extname: 'hbs'
// }));
// app.set('view engine', 'pug');
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secret phrase', resave: false, saveUninitialized: false, store: sessionStore, name: 'vasya'}));
//csrf uses session so we add it after session
app.use(csrf);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
});
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500Page);
app.use(errorController.get404Page);

// mongoConnect(() => {
//     app.listen(3000);
// });
mongoose.connect(process.env.API_URL,  { useNewUrlParser: true })
    .then(_ => app.listen(3000))
    .catch(err => console.log(err));

