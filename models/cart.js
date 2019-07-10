const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, data) => {
            let cart;
            //if file doesnt exist or empty creates cart object with added product
            if(err || data.length < 1) {
                cart = { products: [{id, qty: 1}], totalPrice: price };
            //add or increase quantity if product exists in cart file
            } else {
                cart = JSON.parse(data);
                let copyOfProducts = [...cart.products];
                const existingProductIndex = copyOfProducts.findIndex(product => product.id === id);
                let productCopy;
                if(existingProductIndex > -1) {
                    productCopy = { ...copyOfProducts[existingProductIndex] };
                    productCopy.qty += 1;
                    copyOfProducts[existingProductIndex] = productCopy;
                } else {
                    productCopy = {id, qty: 1};
                    copyOfProducts = [...copyOfProducts, productCopy];
                }
                cart = { products: copyOfProducts, totalPrice: parseInt(cart.totalPrice) + parseInt(price) };
            }
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
        });
}};