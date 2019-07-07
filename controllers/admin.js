const Product = require('../models/product');

const getAddProductPage = (req, res, next) => {
    res.render('admin/add-product', {
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
        res.render('admin/admin-product-list', {
            products,
            pageTitle: 'Admin products',
            path: '/admin/products',
        });
    });
};

module.exports = {
    getAddProductPage,
    postAddProductPage,
    getProductsPage
}