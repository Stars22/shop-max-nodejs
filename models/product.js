const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
        .then(products => {
            return products;
        })
        .catch(err => console.log(err));
    }

    static findProduct(prodId) {
        const db = getDb();
        return db.collection('products').find({_id: mongodb.ObjectID(prodId)}).next()
        .then(product =>{
            console.log(product);
            return product;
        })
        .catch(err => console.log(err));
    }
}

module.exports = Product;