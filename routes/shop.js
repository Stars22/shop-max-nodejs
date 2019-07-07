const path = require('path');
const express = require('express');
const rootDir = require('../util/path')
const adminData = require('./admin');

const router = express.Router();

const shopController = require('../controllers/shop')

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProductsPage);
router.get('/cart', shopController.getCartPage);
router.get('/checkout', shopController.getCheckoutPage);
module.exports = router;