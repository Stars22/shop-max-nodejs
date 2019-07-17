const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
//const handleBars = require('express-handlebars');

const app = express();

const errorController = require('./controllers/errors');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const { mongoConnect } = require('./util/database');
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

app.use((req, res, next) => {
    User.find('5d2ebae7fde6281b5ccba7e5')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

mongoConnect(() => {
    app.listen(3000);
});

