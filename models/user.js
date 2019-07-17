const { getDb } = require('../util/database');
const { ObjectID } = require('mongodb');

class User {
    constructor(userName, email) {
        this.name = userName;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(result => console.log(result))
        .catch(err => console.log(err));
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