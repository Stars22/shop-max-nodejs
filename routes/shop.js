const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const authController = require('../controllers/auth');

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProductsPage);
router.get('/products/:productId', shopController.getProductPage);
router.get('/cart', shopController.getCartPage);
router.get('/orders', shopController.getOrdersPage);
// router.get('/checkout', shopController.getCheckoutPage);
router.get('/signup', authController.getSignup);

router.post('/cart', shopController.postCartPage);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post('/create-order', shopController.postOrder);
router.post('/signup', authController.postSignup);
module.exports = router;