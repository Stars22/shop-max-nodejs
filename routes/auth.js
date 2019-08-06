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
            // if(value === 'test@test.com') {
            //     throw new Error('This email adress is forbidden');
            // }
            // return true;
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
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);
module.exports = router;