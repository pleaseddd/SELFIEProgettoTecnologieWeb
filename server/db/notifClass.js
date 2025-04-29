const mongoose = require('mongoose');
const webpush = require('web-push');
require('dotenv').config({ path: __dirname + "/../client/.env" });

const NotifSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},

	title: {
		type: String,
		required: true
	},

	body: {
		type: String,
		required: true
	},

	time: {
		type: String,
		required: true
	},

	sent: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

const Notification = mongoose.model('Notification', NotifSchema);

module.exports = {
	new_notif: async (notif) => {
		const newnotif = new Notification(notif);
		return newnotif.save();
	},

	find: async (time, sent) => {
		return await Notification.find({ time, sent });
	},

	notif_sent: async (id) => {
		const filter = { _id: id };
		const update = { sent: true };

		await Notification.findOneAndUpdate(filter, update);
	},

	setVapidKeys: () => {
		webpush.setVapidDetails(
			"mailto:isabella.amaducci3@studio.unibo.it",
			process.env.VPKEY_PUBLIC,
			process.env.VPKEY_PRIVATE
		);
		console.log("web-push settato");
	}
};
