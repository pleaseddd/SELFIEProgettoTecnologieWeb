const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	name: {
		type: String,
		required: true
	},

	endpoint: {
		type: String,
		required: true,
		unique: true
	},

	keys: {
		p256dh: String,
		auth: String
	}
}, {
	collection: "swsubs",
	timestamps: true
});

const Subscription = mongoose.model('Subscription', SubSchema);

module.exports = {
	POST_list: async (req, res) => {
		const subs = await Subscription.find({ user: req.body.user_id });
		res.status(201).json(subs);
	},

	POST_getswsub: async (req, res) => {
		const sub = await Subscription.findOne({ endpoint: req.body.endpoint });
		res.status(201).json(sub);
	},

	POST_subscribe: (req, res) => {
		try {
			const sub = Object.assign(req.body.sub, {
				name: req.body.name,
				user: req.body.user_id
			});

			const newsub = new Subscription(sub);
			newsub.save();

			res.status(201).json({ message: "Iscrizione salvata" });
		}
		catch(error) {
			res.status(500).json({ error: error });
			console.error("Errore nell'iscrizione:", error);
		}
	},

	POST_unsubscribe: async (req, res) => {
		try {
			const endpoint = req.body.endpoint;
			await Subscription.findOneAndDelete({ endpoint });

			res.status(201).json({ message: "Iscrizione cancellata" });
		}
		catch(error) {
			console.error("Errore nell'eliminare l'iscrizione:", error);
		}
	},

	POST_updateswsubname: async (req, res) => {
		try {
			const filter = { endpoint: req.body.endpoint };
			const update = { $set: { name: req.body.name } };

			await Subscription.findOneAndUpdate(filter, update);

			res.status(201).json({ message: "Iscrizione aggiornata" });
		}
		catch(err) {
			console.error("Errore nell'aggiornare l'iscrizione:", err);
		}
	},

	findOne: async (endpoint) => {
		return await Subscription.findOne({ endpoint });
	},

	findByUser: async (user_id) => {
		return await Subscription.find({ user: user_id });
	}
};
