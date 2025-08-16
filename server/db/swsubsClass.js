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
	newSwSub: async (sub) => {
		newsub = new Subscription(sub);
		return await newsub.save();
	},

	findBy: async (filter) => {
		if(filter.hasOwnProperty('endpoint'))
			return await Subscription.findOne(filter);
		if(filter.hasOwnProperty('user'))
			return await Subscription.find(filter);
	},

	updateName: async (endpoint, name) => {
		const filter = { endpoint };
		const update = { $set: { name } };
		return await Subscription.findOneAndUpdate(filter, update);
	},

	deleteBy: async (filter) => {
		if(filter.hasOwnProperty('endpoint'))
			return await Subscription.findOneAndDelete(filter);
	}
};
