const mongoose = require("mongoose");

const TimeMachineSchema = new mongoose.Schema(
  {
    fakeNow: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const TimeMachine = mongoose.model("TimeMachine", TimeMachineSchema);

let cachedOffset = 0;

module.exports = {
	newTime: async (fakeNow) => {
		const newtime = await TimeMachine({ fakeNow });
		return await newtime.save();
	},

	deleteAll: async () => {
		return await TimeMachine.deleteMany({});
	},

	loadFake: async () => {
		const lastEntry = await TimeMachine.findOne({}).sort({ updatedAt: -1 });
		if (lastEntry && lastEntry.fakeNow) {
			// fakeNow = data/ora scelta dall’utente
			// updatedAt = momento (real) in cui è stato salvato
			const fakeMs = lastEntry.fakeNow.getTime();
			const realMs = lastEntry.updatedAt.getTime();
			cachedOffset = fakeMs - realMs;
		} else {
			cachedOffset = 0;
		}
	},

	getCurrentTimestamp: () => {
		return Date.now() + cachedOffset;
	},

	getCache: () => cachedOffset,

	resetCache: () => {
		cachedOffset = 0;
	}
};
