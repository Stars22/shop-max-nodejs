const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLoginPage);
router.get('/reset', authController.getResetPage);
router.get('/reset/:token', authController.getNewPassword);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a vaild email')
        .custom((value, { req }) => {
           return User.findOne({email: value})
            .then(userDoc => {
                if(userDoc) {
                    return Promise.reject('The email exists already ');
                }
    })}),
    body('password', 'Please enter a password at least 6 characters').isLength({min: 6}).isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if(value === req.body.password) {
            return true;
        }
        throw new Error('Passwords have to match!');
    })
    ],
    authController.postSignup);
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a vaild email'),
    // .custom(async value => {
    //     const userDoc = await User.findOne({ email: value });
    //     if(!userDoc) throw new Error('Invalid email or password');
    //     return true;
    // }),
    body('password', 'Password has to be valid.').isLength({ min: 5 }).isAlphanumeric()
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);
module.exports = router;