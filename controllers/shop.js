const Product = require('../models/product');

const getProductsPage = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            products,
            pageTitle: 'All products',
            path: '/products',
        });
    });
};

const getIndexPage = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            products,
            pageTitle: 'Max shop',
            path: '/',
        });
    });
};

const getCartPage = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
    });
};

const getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

module.exports = {
    getProductsPage,
    getIndexPage,
    getCartPage,
    getCheckoutPage
}