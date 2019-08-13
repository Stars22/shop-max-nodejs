const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

router.get('/add-product', isAuth, adminController.getAddProductPage);
router.get('/products', isAuth, adminController.getProductsPage);
router.get('/edit-product/:productId', isAuth, adminController.getEditProductPage);

router.post('/add-product', isAuth, [
    body('title').isString().isLength({min: 3}).trim(),
    body('price').isFloat(),
    body('description').isLength({min: 5, max: 300}).trim()
], adminController.postAddProductPage);
router.post('/edit-product', isAuth, [
    body('title').isString().isLength({min: 3}).trim(),
    body('price').isFloat(),
    body('description').isLength({min: 5, max: 300}).trim()
], adminController.postEditProductPage);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);
 
module.exports = router;