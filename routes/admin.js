const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProductPage);
router.get('/products', adminController.getProductsPage);
// router.get('/edit-product/:productId', adminController.getEditProductPage);

router.post('/add-product', adminController.postAddProductPage);
// router.post('/edit-product', adminController.postEditProductPage);
// router.post('/delete-product', adminController.postDeleteProduct);
 
module.exports = router;