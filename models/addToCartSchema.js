const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'produtdetails',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});

const CartModel = mongoose.model('CartItems', cartItemSchema);

module.exports = CartModel;
