const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
	{
    	title: {
			type: String,
			required: true,
			trim: true
		},

    	category: {
			type: String,
			required: true
		},

    	body: { type: String },

	    author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
    	},
	},

	// Aggiunge automaticamente "createdAt" e "updatedAt"
	{ timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);

// richieste
module.exports = {
  // recupera note
  POST_list: async function (req, res) {
    try {
      // filtra per id utente
      const userId = req.body.userid;
      const notes = await Note.find({ author: userId });

      res.status(201).json(notes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // crea nuova nota
  POST_new: async function (req, res) {
    try {
      const { title, category, body, userid } = req.body;
      const newNote = new Note({
        title,
        category,
        body,
        author: userid,
      });
      await newNote.save();
      res.status(201).json(newNote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // restituisce le note in ordine di modifica
  POST_last: async function (req, res) {
	try {
	  const userId = req.body.userid;
	  const numNotes = req.body.limit;
	  const lastNotes = await Note.find({ author: userId })
	  	.sort({ updateAt: 1 })
		.limit(numNotes);

	  res.status(201).json(lastNotes);
	}
	catch(err) {
		res.status(400).json({ message: err.message });
	}
  },

  // elimina nota
  POST_delete: async function (req, res) {
    try {
      const { noteid, userid } = req.body;
      const note = await Note.findById(noteid);
      if (!note) {
        return res.status(404).json({ message: "Nota non trovata" });
      }
      if (note.author.toString() !== userid) {
        return res.status(403).json({ message: "Non autorizzato" });
      }
      await note.deleteOne();
      res.json({ message: "Nota eliminata" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // modifica una nota pre-esistente
  PUT_update: async function (req, res) {
    try {
      const { noteid, title, category, body, userid } = req.body;
      const note = await Note.findById(noteid);
      if (!note) {
        return res.status(404).json({ message: "Nota non trovata" });
      }
      if (note.author.toString() !== userid) {
        return res.status(403).json({ message: "Non autorizzato" });
      }
      note.title = title;
      note.category = category;
      note.body = body;
      await note.save();
      res.json({ message: "Nota aggiornata con successo" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
