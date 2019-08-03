const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLoginPage);
router.get('/reset', authController.getResetPage);
router.get('/reset/:token', authController.getNewPassword);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);
module.exports = router;