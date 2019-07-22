const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{ 
            productId : { type: Schema.Types.ObjectId, required: true },
            quantity: { type: Number, required: true}
        }]
    }
});

module.exports = mongoose.model('User', user);
// const { getDb } = require('../util/database');
// const { ObjectID } = require('mongodb');

// class User {
//     constructor(userName, email, cart, id) {
//         this.name = userName;
//         this.email = email;
//         this.cart = cart;
//         this._id = ObjectID(id);
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//         .then()
//         .catch(err => console.log(err));
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cartProduct => {
//             return cartProduct.productId.toString() === product._id.toString();
//         });
//         let updatedCartItems =  [...this.cart.items];
//         let newQuantity = 1;
//         const db = getDb();
//         if(cartProductIndex > -1) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: ObjectID(product._id),
//                 quantity: newQuantity
//             });
//         }
//         const updatedCart = { items: updatedCartItems };
//         return db.collection('users').updateOne({_id: this._id}, {$set: { cart: updatedCart }});
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(item => item.productId);
//         return db.collection('products').find({_id: {$in: productIds}}).toArray()
//         .then(products => {
//             return products.map(product => {
//                 return {...product,
//                     quantity: this.cart.items.find(item => {
//                         return item.productId.toString() === product._id.toString();
//                     }).quantity
//                     };
//             });
//         });
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(cart => {
//                 const updatedCart = {
//                     items: cart,
//                     user: {
//                         id: this._id
//                     }
//                 };
//                 return db.collection('orders').insertOne(updatedCart);
//             })
//         .then(_ => {
//             this.cart = { items: []};
//             return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: this.cart }});
//         });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({'user.id': this._id}).toArray();
//     }

//     deleteItemFromCart(productId) {
//         let updatedCartItems = this.cart.items.filter(item => !item.productId.equals(productId));
//         const db = getDb();
//         return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: { items: updatedCartItems } }});
//     }

//     static find(id) {
//         const db = getDb();
//         return db.collection('users').findOne({_id: ObjectID(id)})
//         .then(result => {
//             return result;
//         })
//         .catch(err => console.log(err));
//     }
// }

// module.exports = User;