const { getDb } = require('../util/database');
const { ObjectID } = require('mongodb');

class Product {
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? ObjectID(id) : null;
    }

    save() {
        const db = getDb();
        if(this._id) {
            return db.collection('products').updateOne({_id: this._id}, {$set: this})
            .then(result => console.log(result));
        } else {
            return db.collection('products').insertOne(this)
            .then(result => console.log(result))
            .catch(err => console.log(err));
        } 
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
        return db.collection('products').find({_id: ObjectID(prodId)}).next()
        .then(product =>{
            console.log(product);
            return product;
        })
        .catch(err => console.log(err));
    }

    static delete(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: ObjectID(prodId)})
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }
}

module.exports = Product;