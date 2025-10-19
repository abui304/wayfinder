// defines schema for one activity in an itinerary

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    itinerary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary',
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
    cost: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Activity', ActivitySchema);