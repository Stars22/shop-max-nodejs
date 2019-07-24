const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[{
        //product: { _id: {type: Schema.Types.ObjectId, require: true}, title: String  },
        product: { type: Object, required: true },
        quantity:{ type: Number, require: true }
    }],
    user: { userId: Schema.Types.ObjectId }
});

module.exports = mongoose.model('Order', orderSchema);