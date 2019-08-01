const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLoginPage = (req, res, next) => {
    // const isAuthenticated = req.get('Cookie').split('=')[1] === 'true';
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('5d3605c2844db81668aa3d5f')
        .then(user => {
            req.session.isLoggedin = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            }) 
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12);
        })
        .then(hashedPass => {
            const user = new User({
                email,
                password: hashedPass,
                cart: {items: []}
            })
            return user.save();
        })
        .then(_ => res.redirect('/login'))
        .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => res.redirect('/'));
}