/*
 * Il db creato in questo file contiene le iscrizioni
 * al service worker del sito, il quale fa tramite tra il client e il server
 * per la gestione delle notifiche push
 */

//Moduli esterni
const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
    
    //Il nome del dispositivo, puo' essere modificato dall'utente stesso
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
	collection: 'swsubs', //Modifica il nome della collezione
	timestamps: true, //Aggiunge automaticamente "createdAt" e "updatedAt"
});

const Subscription = mongoose.model('Subscription', SubSchema);

//Funzioni che si possono usare in file esterni
module.exports = {
    /*
     * Crea una nuova iscrizione
     * @param sub: Object, l'oggetto con i dati dell'iscrizione
     * returns: Object, il nuovo documento della collezione
     */
	newSwSub: async (sub) => {
		newsub = new Subscription(sub);
		return await newsub.save();
	},
    
    /*
	 * Trova una/delle iscrizione/i esistente/i
	 * @param filter: Object, i parametri di ricerca
	 * possono essere 'endpoint' per un'iscrizione specifica
	 * oppure 'user' per tutte le iscrizioni di un utente
	 * returns: [Object], l'array delle iscrizioni trovate
	 */
	findBy: async (filter) => {
		if(filter.hasOwnProperty('endpoint'))
			return await Subscription.findOne(filter);
		if(filter.hasOwnProperty('user'))
			return await Subscription.find(filter);
	},
    
    /*
     * Modifica il nome di un'iscrizione
     * @param endpoint: Object, per trovare l'iscrizione di riferimento
     * @param name: String, il nuovo nome
     * returns: Object, l'iscrizione modificata del db
     */
	updateName: async (endpoint, name) => {
		const filter = { endpoint };
		const update = { $set: { name } };
		return await Subscription.findOneAndUpdate(filter, update);
	},
    
    /*
     * Elimina un'iscrizione trovata tramite endpoint
     * @param filter: Object, l'endpoint di riferimento
     * returns: l'iscrizione eliminata dal db
     */
	deleteBy: async (filter) => {
		if(filter.hasOwnProperty('endpoint'))
			return await Subscription.findOneAndDelete(filter);
	}
};
