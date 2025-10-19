// defines schema for one activity in an itinerary

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    itinerary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    cost: {
        type: Number,
        required: true,
        default: 0,
    },
    imageUrl: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Activity', ActivitySchema);