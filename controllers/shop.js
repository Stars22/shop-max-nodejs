const Product = require('../models/product');
const Cart = require('../models/cart');

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

const getProductPage = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findProduct(prodId, product => {
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products' 
        });
    });
};

const getIndexPage = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/index', {
            products,
            pageTitle: 'Max shop',
            path: '/',
        });
    })
    .catch(err => console.log(err));
};

const getCartPage = (req, res, next) => {
    Cart.showCart(cart => {
        if(cart) {
            Product.fetchAll(products => {
                const cartProducts = [];
                for( let product of products ) {
                    const cartProduct = 
                        cart.products.find(cartProd => cartProd.id === product.id);
                    if(cartProduct) {
                        cartProducts.push({...product, qty: cartProduct.qty});
                    }      
                }
                res.render('shop/cart', {
                    pageTitle: 'Cart',
                    path: '/cart',
                    cartProducts
                });
            });
        } else {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                cartProducts: null
            });
        }
    });
};

const getOrdersPage = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
    });
};

const getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

const postCartPage = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findProduct(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findProduct(prodId, product => {
        Cart.removeProduct(prodId, product.price);
        res.redirect('/cart');
    });
};


module.exports = {
    getProductsPage,
    getProductPage,
    getIndexPage,
    getCartPage,
    getCheckoutPage,
    getOrdersPage,
    postCartPage,
    postCartDeleteProduct
};