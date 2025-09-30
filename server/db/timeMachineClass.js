//Moduli esterni
const mongoose = require("mongoose");

const TimeMachineSchema = new mongoose.Schema(
  {
    fakeNow: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true //Aggiunge automaticamente "createdAt" e "updatedAt"
  }
);

const TimeMachine = mongoose.model("TimeMachine", TimeMachineSchema);

let cachedOffset = 0;
let flag=0;

//Funzioni che si possono usare in file esterni
module.exports = {
    /*
     * Crea un tempo falsificato della time machine
     * @param fakeNow: Object, l'oggetto con i dati
     * returns: Object, il nuovo documento della collezione
     */
	newTime: async (fakeNow) => {
		const newtime = await TimeMachine({ fakeNow });
		flag=Date.now();
		return await newtime.save();
	},
    
    //Cancella tutti i tempi falsificati
	deleteAll: async () => {
		flag=Date.now();
		return await TimeMachine.deleteMany({});
	},

    //Carica un tempo falsificato, l'ultimo modificato del db
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
	
	getFlag: () => flag,
	resetCache: () => {
		cachedOffset = 0;
	}
};
