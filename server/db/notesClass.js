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

module.exports = {
	newNote: async (note) => {
		const newnote = new Note(note);
		return await newnote.save();
	},

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
