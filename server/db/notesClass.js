//Moduli esterni
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
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
}, { timestamps: true }); //Aggiunge automaticamente "createdAt" e "updatedAt"

const Note = mongoose.model("Note", NoteSchema);

//Funzioni che si possono usare in file esterni
module.exports = {
    /*
	 * Crea una nuova nota
	 * @param note: Object, l'oggetto con i dati della nota
	 * returns: Object, il nuovo documento della collezione
	 */
	newNote: async (note) => {
		const newnote = new Note(note);
		return await newnote.save();
	},
    
    /*
	 * Trova una/delle nota/e esistente/i
	 * @param filter: Object, i parametri di ricerca
	 * possono essere 'id' per una nota specifica
	 * oppure 'author' per tutti le note di un utente
	 * @param opts: String, le opzioni per manipolare l'array risultante
	 * returns: [Object], l'array delle note trovate
	 */
	findBy: async (filter, opts) => {
		let res;
		if(filter.hasOwnProperty('id'))
			res = await Note.findById(filter.id);
		if(filter.hasOwnProperty('author'))
			res = await Note.find(filter);

		if(opts) {
			const { type, num } = opts.split(' ');
			if(type == 'last')
				res = res.sort({ updatedAt: 1}).limit(num);
		}

		return res;
	}
};
