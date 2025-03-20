const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    body: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
},
    {
        timestamps: true // Aggiunge automaticamente "createdAt" e "updatedAt"
    });

const Note = mongoose.model('Note', NoteSchema);

// crud
module.exports = {
    // recupera note
    notePOST_list: async function (req, res) {
        try {
            // filtra per id utente

            const userId = req.body.userid;
            const notes = await Note.find({ author: userId });

            // non filtra
            // const notes = await Note.find();
            res.json(notes);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // crea nuova nota
    notePOST_new: async function (req, res) {
        try {
            const { title, category, body, userid } = req.body;


            const newNote = new Note({
                title,
                category,
                body,
                author: userid
            });
            await newNote.save();
            res.status(201).json(newNote);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    //elimina nota
    noteDELETE: async function (req, res) {
        try {
            const noteId = req.params.id;
            //cerco la nota
            const note = await Note.findById(noteId);
            if (!note) {
                return res.status(404).json({ message: "Nota non trovata" });
            }
            //controllo che la nota sia dell'utente
            if (note.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "Non autorizzato" });
            }
            await note.remove();
            res.json({ message: "Nota eliminata" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
