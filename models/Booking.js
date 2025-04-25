const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({

    bookingDate: {
        type: Date,
        required: true
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'Provider',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
    
});

module.exports = mongoose.model('Booking', BookingSchema);