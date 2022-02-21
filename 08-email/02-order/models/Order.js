const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {
        type: String,
        required: true,
        validate: [
            {
                validator(value) {
                    return /\+?\d{6,14}/.test(value);
                },
                message: 'Неверный формат номера телефона.',
            },
        ],
    },
    address: {
        type: String,
        required: true,
    },

});

module.exports = connection.model('Order', orderSchema);
