const path = require('path');
const express = require('express');
const rootDir = require('../util/path')
const adminData = require('./admin');

const router = express.Router();

const productsController = require('../controllers/products')

router.get('/', productsController.getProductsPage);

module.exports = router;