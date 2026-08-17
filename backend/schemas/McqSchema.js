const mongoose = require('mongoose');

const McqSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, 'Options array must contain exactly 4 items']
    },
    correctOptionIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 4;
}

module.exports = mongoose.model('Mcq', McqSchema);
