const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true},
    description: String,
    imageUrl: String,
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { toObject: { virtuals: true }});
product.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });

module.exports = mongoose.model('Product', product);
// const { getDb } = require('../util/database');
// const { ObjectID } = require('mongodb');

// class Product {
//     constructor(title, imageUrl, description, price, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? ObjectID(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         if(this._id) {
//             return db.collection('products').updateOne({_id: this._id}, {$set: this})
//             .then(result => console.log(result));
//         } else {
//             return db.collection('products').insertOne(this)
//             .then()
//             .catch(err => console.log(err));
//         } 
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//         .then(products => {
//             return products;
//         })
//         .catch(err => console.log(err));
//     }

//     static findProduct(prodId) {
//         const db = getDb();
//         return db.collection('products').find({_id: ObjectID(prodId)}).next()
//         .then(product =>{
//             return product;
//         })
//         .catch(err => console.log(err));
//     }

//     static delete(prodId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: ObjectID(prodId)})
//         .then()
//         .catch(err => console.log(err));
//     }
// }

// module.exports = Product;