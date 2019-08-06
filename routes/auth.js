const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLoginPage);
router.get('/reset', authController.getResetPage);
router.get('/reset/:token', authController.getNewPassword);
router.get('/signup', authController.getSignup);
router.post('/signup', check('email')
.isEmail()
.withMessage('Please enter a vaild email')
.custom((value, { req }) => {
    if(value === 'test@test.com') {
        throw new Error('This email adress is forbidden');
    }
    return true;
}),
authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);
module.exports = router;