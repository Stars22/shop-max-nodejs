const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[{
        product: { type: Object, required: true },
        quantity:{ type: Number, require: true }
    }],
    user: { userId: Schema.Types.ObjectId }
});

module.exports = mongoose.model('Order', orderSchema);