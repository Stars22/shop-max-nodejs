const { getDb } = require('../util/database');
const { ObjectID } = require('mongodb');

class User {
    constructor(userName, email, cart, id) {
        this.name = userName;
        this.email = email;
        this.cart = cart;
        this._id = ObjectID(id);
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then()
        .catch(err => console.log(err));
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() === product._id.toString();
        });
        let updatedCartItems =  [...this.cart.items];
        let newQuantity = 1;
        const db = getDb();
        if(cartProductIndex > -1) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: ObjectID(product._id),
                quantity: newQuantity
            });
        }
        const updatedCart = { items: updatedCartItems };
        return db.collection('users').updateOne({_id: this._id}, {$set: { cart: updatedCart }});
    }

    static find(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: ObjectID(id)})
        .then(result => {
            return result;
        })
        .catch(err => console.log(err));
    }
}

module.exports = User;