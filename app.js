const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
//const handleBars = require('express-handlebars');

const app = express();

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
app.use(session({secret: 'secret phrase', resave: false, saveUninitialized: false}));

app.use((req, res, next) => {
    User.findById('5d3605c2844db81668aa3d5f')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404Page);

// mongoConnect(() => {
//     app.listen(3000);
// });
mongoose.connect(process.env.API_URL,  { useNewUrlParser: true })
    .then(_ => {
        User.findOne()
            .then(user => {
                if(!user) {
                    const user = new User({
                        name: 'Ace',
                        email: 'mail@gmail.com',
                        cart: { items: []}
                    });
                    user.save();
                }
                app.listen(3000);
            });
    })
    .catch(err => console.log(err));

