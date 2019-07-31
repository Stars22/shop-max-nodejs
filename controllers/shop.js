const Product = require('../models/product');
const Order = require('../models/order');

const getProductsPage = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            products,
            pageTitle: 'All products',
            path: '/products',
            isAuthenticated: req.session.isLoggedin
        });
    })
    .catch(err => console.log(err));
};

const getProductPage = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products',
            isAuthenticated: req.session.isLoggedin
        });
    });
};

const getIndexPage = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/index', {
            products,
            pageTitle: 'Max shop',
            path: '/',
            isAuthenticated: req.session.isLoggedin
        });
    })
    .catch(err => console.log(err));
};

const getCartPage = (req, res, next) => {
    req.user.populate('cart.items.productId').execPopulate()
    .then(user => {
        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            cartProducts: user.cart.items,
            isAuthenticated: req.session.isLoggedin
        });
    });
    // Cart.showCart(cart => {
    //     if(cart) {
    //         Product.fetchAll(products => {
    //             const cartProducts = [];
    //             for( let product of products ) {
    //                 const cartProduct = 
    //                     cart.products.find(cartProd => cartProd.id === product.id);
    //                 if(cartProduct) {
    //                     cartProducts.push({...product, qty: cartProduct.qty});
    //                 }      
    //             }
    //             res.render('shop/cart', {
    //                 pageTitle: 'Cart',
    //                 path: '/cart',
    //                 cartProducts
    //             });
    //         });
    //     } else {
    //         res.render('shop/cart', {
    //             pageTitle: 'Cart',
    //             path: '/cart',
    //             cartProducts: null
    //         });
    //     }
    // });
};

const getOrdersPage = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders,
                isAuthenticated: req.session.isLoggedin
            });
        });
};

const getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        isAuthenticated: req.session.isLoggedin
    });
};

const postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId').execPopulate()
        .then(user => {
            const products = user.cart.items.map(prod => {
                //return { product: prod.productId._doc, quantity: prod.quantity }; ._doc gets 'raw' document
                return { product: prod.productId._doc, quantity: prod.quantity };
            });
            console.log(products);
            const order = new Order({
                products,
                user: { userId: user._id }
            });
            return order.save();
        })
        .then(_ => req.user.clearCart())
        .then(_ => res.redirect('/orders'));
    
    // req.user.addOrder()
    // .then(_ => res.redirect('/orders'));
};

const postCartPage = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        }).then(_ => res.redirect('/cart'))
        .catch(err => console.log(err));
};

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(_ => res.redirect('/cart'));
};


module.exports = {
    getProductsPage,
    getProductPage,
    getIndexPage,
    getCartPage,
    getCheckoutPage,
    getOrdersPage,
    postCartPage,
    postCartDeleteProduct,
    postOrder
};