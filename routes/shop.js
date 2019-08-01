const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProductsPage);
router.get('/products/:productId', shopController.getProductPage);
router.get('/cart', isAuth, shopController.getCartPage);
router.get('/orders', isAuth, shopController.getOrdersPage);
// router.get('/checkout', shopController.getCheckoutPage);
router.get('/signup', authController.getSignup);

router.post('/cart', isAuth, shopController.postCartPage);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', isAuth, shopController.postOrder);
router.post('/signup', authController.postSignup);
module.exports = router;