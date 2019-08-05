const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedin
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
            isAuthenticated: req.session.isLoggedin
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
    const { title, imageUrl, price, description} = req.body;
    const userId = req.user._id;
    const product = new Product({ title, imageUrl, description, price, userId });
    product.save()
    .then(result => {
        console.log('Product was created');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postEditProductPage = (req, res) => {
    const { title, imageUrl, price, description, id } = req.body;
    Product.findById(id)
    .then(product => {
        if(!product.userId.equals(req.user._id)) {
            return res.redirect('/');
        }
        product.title = title;
        product.imageUrl = imageUrl;
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
            isAuthenticated: req.session.isLoggedin
        });
    })
    .catch(err => console.log(err));
};
