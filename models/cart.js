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
            //if file doesnt exist or empty creates cart file with added product
            if(err || data.length < 1) {
                cart = { products: [{id, qty: 1}], totalPrice: price };
            //add or increase quantity if product exists in cart file
            } else {
                cart = JSON.parse(data);
                const updatedProducts = cart.products.map(product => {
                    if(product.id === id) {
                        return {...product, qty: product.qty + 1};
                    }
                    return product;
                });
                cart = { products: updatedProducts, totalPrice: cart.totalPrice + parseInt(price) };
            }
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
        });
}};