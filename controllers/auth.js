const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGrid({
    auth: {
        api_key: process.env.API_SEND_GRID
    }
}));

exports.getLoginPage = (req, res, next) => {
    // const isAuthenticated = req.get('Cookie').split('=')[1] === 'true';
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email })
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalid email or password')
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch) {
                        req.session.isLoggedin = true;
                        req.session.user = user;
                        return req.session.save(err => {
                                console.log(err);
                                res.redirect('/');
                            }) 
                    }
                    req.flash('error', 'Invalid email or password')
                    return res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
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
                req.flash('error', 'The email exists already ');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPass => {
                    const user = new User({
                        email,
                        password: hashedPass,
                        cart: {items: []}
                    })
                    return user.save();
                })
                .then(_ => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@ndoe.com',
                        subject: 'Signup succeded',
                        html: '<h1>You signed up</h1>'
                    })                   
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => res.redirect('/'));
}

exports.getResetPage = (req, res) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message
    });
}

exports.postReset = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    res.flash('error', 'No account found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpire = Date.now() + 3600000;
                return user.save()
                    .then(result => {
                        res.redirect('/login');
                        return transporter.sendMail({
                                to: req.body.email,
                                from: 'shop@ndoe.com',
                                subject: 'Password reset',
                                html: `
                                <p>You requested password reset</p>
                                <a href="http://localhost:3000/reset/${token}">Reset password</a>
                                `
                            }) 
                    });
            })
            .catch(err => console.log(err))
    })
}