const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedin,
        hasError: false,
        errorMessage: null
    });
};

exports.getEditProductPage = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product,
            isAuthenticated: req.session.isLoggedin,
            hasError: false,
            errorMessage: null
        });
    });
};

exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.id;
    //check both product id and authorized user to delete product
    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(_ => res.redirect('/products'));
};

exports.postAddProductPage = (req, res) => {
    const { title, price, description} = req.body;
    const image = req.file;
    const userId = req.user._id;
    const errors = validationResult(req);
    if(!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            product: { title, price, description },
            isAuthenticated: req.session.isLoggedin,
            hasError: true,
            errorMessage: 'Attached file is not an image'
        });
    }
    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            product: { title, price, description },
            isAuthenticated: req.session.isLoggedin,
            hasError: true,
            errorMessage: errors.array()[0].msg
        });
    }
    const imageUrl = image.path;
    const product = new Product({ title, imageUrl, description, price, userId });
    product.save()
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        // return res.status(500).render('admin/edit-product', {
        //     pageTitle: 'Add Product',
        //     path: '/admin/add-product',
        //     editing: false,
        //     product: { title, imageUrl, price, description },
        //     isAuthenticated: req.session.isLoggedin,
        //     hasError: true,
        //     errorMessage: 'Database operation failed, please try again.'
        // });
        //res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postEditProductPage = (req, res) => {
    const { title, price, description, id } = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product: { title, price, description, _id: id },
            isAuthenticated: req.session.isLoggedin,
            hasError: true,
            errorMessage: errors.array()[0].msg
        });
    }
    Product.findById(id)
    .then(product => {
        if(!product.userId.equals(req.user._id)) {
            return res.redirect('/');
        }
        product.title = title;
        if(image) {
            product.imageUrl = image.path;
        }
        product.price = price;
        product.description = description;
        product.save().then(_ => res.redirect('/products'));
    });
};

exports.getProductsPage = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    Product.find({userId: req.user._id})
    //.select('title price -id') filtering fields space separated (minus for excluding field)
    //.populate('user')
    .then(products => {
        res.render('admin/products', {
            products,
            pageTitle: 'Admin products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedin,
            hasError: false
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
