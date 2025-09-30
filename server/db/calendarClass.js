//Moduli esterni
const mongoose = require("mongoose"); 
const { RRule } = require("rrule"); //Per gli eventi ricorrenti

const EventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},

    //Le possibili categorie sono decise dall'utente nelle impostazioni
	category: {
		type: String,
		required: true,
	},

	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

    /*
     * Data e ora di inizio e di fine evento,
     * sono entrambi facoltativi per poterle omettere nella
     * creazione di un evento, nel caso in cui un evento
     * non abbia inizio ma solo una scadenza (attivita')
     */
	begin: Date,
	end: Date,
    
	location: { type: String, trim: true },

    /*
     * Le informazioni necessarie per poter salvare
     * l'evento anche su google calendar,
     * che comprende il consenso dell'utente (isSaved)
     * e il calendario specifico in cui salvarlo (calendarId).
     * L'evento google viene poi immagazzinato in eventId.
     * isSaved rimane false gli altri due parametri vengono ignorati
     */
	google: {
		isSaved: { type: Boolean, default: false },
		calendarId: String,
		eventId: String
	},

    //Questo booleano decide se la rruleStr esiste oppure no
	isRecurring: Boolean,
	rruleStr: String,
	
	urgency: String,

	color: { type: String, default: "#3788d8" },
    
    //Impostazioni del pomodoro dell'evento
	pomodoro: {
		on: { type: Boolean, default: false },
		duration: { type: Number, default: 0 },
		workoption: { type: Number, default: 25 },
		breakoption: { type: Number, default: 5 },
	},
}, { timestamps: true }); //Aggiunge automaticamente "createdAt" e "updatedAt"

const Event = mongoose.model("Event", EventSchema);

//Funzioni che si possono usare in file esterni
module.exports = {
	/*
	 * Crea un nuovo evento
	 * @param event: Object, l'oggetto con i dati dell'evento
	 * returns: Object, il nuovo documento della collezione
	 */
	newEvent: async (event) => {
		const newevent = new Event(event);
		return await newevent.save();
	},

	/*
	 * Trova un/degli evento/i esistente/i
	 * @param filter: Object, i parametri di ricerca
	 * possono essere 'id' per un evento specifico
	 * oppure 'author' per tutti gli eventi di un utente
	 * @param opts: String, le opzioni per manipolare l'array risultante
	 * returns: [Object], l'array degli eventi trovati
	 */
	findBy: async (filter, opts) => {
		let res;
		if(filter.hasOwnProperty('id'))
			res = await Event.findById(filter.id);
		if(filter.hasOwnProperty('author'))
			res = await Event.find(filter);

		if(opts) {
			const { type, limit } = opts.split(' ');
			if(type == 'upcoming')
				res = res.sort({ begin: 1 }).limit(limit);
		}

		return res;
	},
    
    /*
	 * Elimina un solo evento tramite filtro
	 * @param filter: Object, i parametri di ricerca
	 * returns: Object, l'evento eliminato dal db
	 */
	deleteBy: async (filter) => {
		return await Event.findOneAndDelete(filter);
	},
    
    /*
	 * Modifica un evento esistente
	 * @param filter: Object, i parametri di ricerca
	 * @param update: Object, le modifiche che si vogliono apportare
	 * returns: Object, l'evento modificato del db
	 */
	update: async (filter, update) => {
		return await Event.findOneAndUpdate(filter, update, { new: true });
	}
};
