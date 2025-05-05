const mongoose = require("mongoose");
const { RRule } = require("rrule");

const notifs = require('./notifClass.js');

const EventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},

	category: {
		type: String,
		required: true,
	},

	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	begin: Date,
	end: Date,

	location: {
		type: String,
		required: false,
		trim: true,
	},

	isRecurring: Boolean,
	rruleStr: String,
	urgency: String,

	color: {
		type: String,
		default: "#3788d8",
	},
}, {
	timestamps: true
});

const Event = mongoose.model("Event", EventSchema);

module.exports = {
	// Elenco eventi per autore
	POST_list: async (req, res) => {
		try {
			const { userid } = req.body;
			const events = await Event.find({ author: userid });
			res.status(200).json(events);
		}
		catch(err) {
			res.status(500).json({ message: err.message });
		}
	},

  // Nuovo evento
	POST_new: async (req, res) => {
		try {
			const newEvent = new Event(req.body);
			await newEvent.save();

			switch(req.body.urgency) {
				case "urgente":
					for(let i=0; i<3; i++) {
// 						notifs.new_notif({
// 							userid: req.body.author,
// 							title: req.body.title,
//
// 						});
					}
				break;

				case "non troppo urgente":
				break;

				case "non urgente":
				break;
			};

			res.status(201).json(newEvent);
		}
		catch(err) {
			console.log("Errore salvataggio evento:", err);
			res.status(400).json({ error: err.message });
		}
	},

	// Aggiorna evento
	POST_update: async (req, res) => {
		try {
			const { _id, userid } = req.body;
			const filter = { _id, author: userid};

			const updated = await Event.findOneAndUpdate(
				filter, req.body, { new: true }
			);

			if (!updated)
				return res.status(403).json({ error: "Accesso negato" });

			res.json(updated);
		}
		catch(err) {
			res.status(400).json({ error: err.message });
		}
	},

	// Elimina evento
	POST_delete: async (req, res) => {
		try {
			const { _id, author } = req.body;
			const deleted = await Event.findOneAndDelete({ _id, author });

			if (!deleted)
				return res.status(403).json({ error: "Accesso negato" });

			res.json({ message: "Evento eliminato" });

		}
		catch(err) {
			res.status(400).json({ error: err.message });
		}
	},

	// Elenco eventi futuri
	POST_upcoming: async (req, res) => {
		try {
			const { userid } = req.body;
			const now = new Date();
	
			const events = await Event.find({
				author: userid,
				begin: { $gte: now }
			})
			.sort({ begin: 1 }) 
			.limit(3); 
	
			res.status(200).json(events);
		}
		catch (err) {
			res.status(500).json({ error: err.message });
		}
	},

};
