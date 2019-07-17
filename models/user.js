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
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct._id === product._id;
        });
        const updatedCart = { items: [{...product, quantity: 1}] };
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, {$set: { cart: updatedCart }});
    }

    static find(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: ObjectID(id)})
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(err => console.log(err));
    }
}

module.exports = User;