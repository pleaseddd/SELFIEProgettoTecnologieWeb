const mongoose = require("mongoose");
const { RRule } = require("rrule");
const { Time, dateSubTime } = require("../utils/timeManager.js");
const notifs = require("./notifClass.js");

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

	googleCal: String,

	isRecurring: Boolean,
	rruleStr: String,
	urgency: String,

	color: {
		type: String,
		default: "#3788d8",
	},

	pomodoro: {
		on: { type: Boolean, default: false },
		duration: { type: Number, default: 0 },
		workoption: { type: Number, default: 25 },
		breakoption: { type: Number, default: 5 },
	},
}, { timestamps: true });

const Event = mongoose.model("Event", EventSchema);

module.exports = {
	newEvent: async (event) => {
		const newevent = new Event(event);
		return await newevent.save();
	},

	findBy: async (filter, opts) => {
		let res;
		if(filter.hasOwnProperty('id'))
			res = await Event.findById(filter.id);
		if(filter.hasOwnProperty('author'))
			res = await Event.find(filter);

		if(opts) {
			const { type, limit } = opts.split(' ');
			if(type == 'upcoming')
				res = res.sort({ begin: 1}).limit(limit);
		}

		return res;
	},

	deleteBy: async (filter) => {
		return await Event.findOneAndDelete(filter);
	},

	update: async (filter, update) => {
		return await Event.findOneAndUpdate(filter, update, { new: true });
	}
};
