const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {   
    fs.readFile(p, (err, data) => {
        let products = [];
        if(!err) {
            products = JSON.parse(data);
        }
        cb(products);
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => console.log(err));
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findProduct(id, cb) {
        getProductsFromFile(products =>{
            const product = products.find(prod => prod.id === id);
            cb(product);
        });
    }
};