const Product = require('../models/product');
const getAddProductPage = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

const postAddProductPage = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

const getProductsPage = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    Product.fetchAll((products) => {
        res.render('shop', {
            products,
            pageTitle: 'Max shop',
            hasProducts: products.length > 0,
            path: '/',
            activeShop: true,
            productCSS: true
        });
    });
};

module.exports = {
    getAddProductPage,
    postAddProductPage,
    getProductsPage
}