// defines the schema for a travel itinerary

const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    days: [{
        dayNumber: Number,
        activities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }],
        dailyCost: {
            type: Number,
            default: 0
        }
    }],
    totalCost: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);