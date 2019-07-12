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
    constructor(title, imageUrl, description, price, id = null) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            let updatedProducts;
            if(this.id) { 
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
            } else {
                this.id = Math.random().toString();
                updatedProducts = products.concat(this);
            }
            fs.writeFile(p, JSON.stringify(updatedProducts), err => console.log(err));
        });
    }

    static delete(id) {
        getProductsFromFile((products) => {
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => console.log(err));
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