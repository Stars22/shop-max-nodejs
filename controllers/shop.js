const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');

const getProductsPage = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            products,
            pageTitle: 'All products',
            path: '/products'
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
            path: '/products'
        });
    });
};

const getIndexPage = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/index', {
            products,
            pageTitle: 'Max shop',
            path: '/'
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
            cartProducts: user.cart.items
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
            });
        });
};

const getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

const getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if(!order) return next(new Error('No order found.'));
            if(!order.user.userId.equals(req.user._id)) return next(new Error('Unathorized'));
            const invoiceFile = 'invoice' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceFile);
            // fs.readFile(invoicePath, (err, data) => {
            //     if(err) return next(err);
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
            //     res.send(data);
            // });
            const file = fs.createReadStream(invoiceFile);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
            file.pipe(res);
        })
        .catch(err => next(err));
}

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
    getInvoice,
    postCartPage,
    postCartDeleteProduct,
    postOrder
};