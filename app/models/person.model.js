const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
    name: String,
    played: Number,
    won: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Person', PersonSchema);