const mongoose = require('mongoose');
const webpush = require('web-push');

const options = {
	collection: 'notifs',
	timestamps: true,
	discriminatorKey: 'kind'
};

const NotifSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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

	sent: {
		type: Boolean,
		default: false
	}
}, options);

const Notification = mongoose.model('Notification', NotifSchema);

/*
const EventNotif = Notification.discriminator(
	'EventNotif',
	new mongoose.Schema({
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event'
		},
	}, options)
);

const PomodoroNotif = Notification.discriminator(
	'PomodoroNotif',
	new mongoose.Schema({
		pomodoro: {}
	}, options)
);*/

module.exports = {
	new_notif: async (notif) => {
		const newnotif = new Notification(notif);
		return newnotif.save();
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

	notif_sent: async (id) => {
		const filter = { _id: id };
		const update = { sent: true };

		await Notification.findOneAndUpdate(filter, update);
	}
};
