const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    name: String,
    played: Number,
    won: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);