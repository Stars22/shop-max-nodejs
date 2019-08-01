const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/add-product', isAuth, adminController.getAddProductPage);
router.get('/products', isAuth, adminController.getProductsPage);
router.get('/edit-product/:productId', isAuth, adminController.getEditProductPage);

router.post('/add-product', isAuth, adminController.postAddProductPage);
router.post('/edit-product', isAuth, adminController.postEditProductPage);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
 
module.exports = router;