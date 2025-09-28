const mongoose = require('mongoose');
const webpush = require('web-push');

const options = {
	collection: 'notifs',
	timestamps: true,
	discriminatorKey: 'kind'
};

const NotifSchema = new mongoose.Schema({
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
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
		type: Date,
		required: true
	},

	rawData: {
		mod: String,
		advance: {
			minutes: Number,
			hours: Number,
			days: Number,
			weeks: Number,
			months: Number
		}
	}
}, options);

const Notification = mongoose.model('Notification', NotifSchema);

module.exports = {
	new_notif: async (notif) => {
		const newnotif = new Notification(notif);
		return newnotif.save();
	},

	findByEvent: async (event) => {
		return await Notification.find({ event });
	},

	findCurrentPendings: async () => {
		const now = new Date().setSeconds(0, 0);
		return await Notification.find({ 
			time: now,
			sent: false
		});
	},

	findAll: async () => {
		return await Notification.find();
	},

	deleteNotif: async (id) => {
		return await Notification.deleteOne({_id: id});
	},

	deleteByEvent: async(event) => {
		return await Notification.deleteMany({ event });
	}
};
