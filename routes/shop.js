const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProductsPage);
router.get('/products/:productId', shopController.getProductPage);
router.get('/cart', isAuth, shopController.getCartPage);
router.get('/orders', isAuth, shopController.getOrdersPage);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
// router.get('/checkout', shopController.getCheckoutPage);

router.post('/cart', isAuth, shopController.postCartPage);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', isAuth, shopController.postOrder);
module.exports = router;