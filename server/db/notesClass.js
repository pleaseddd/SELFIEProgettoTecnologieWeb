const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, },
    category: { type: String, required: true, },
    body: { type: String, required: false, },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    // crated: { type Date, API data ... , },
    // lastModified: {type Date, API data, }, 
});

const Note = mongoose.model('Note', NotesSchema);

// crud
module.exports = {
