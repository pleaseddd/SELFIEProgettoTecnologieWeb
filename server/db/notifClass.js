//Moduli esterni
const mongoose = require('mongoose');
const webpush = require('web-push');

const NotifSchema = new mongoose.Schema({
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},

    //In questo caso coincide con il titolo dell'evento di riferimento
	title: {
		type: String,
		required: true
	},
    
    //Comunica quanto tempo manca o quanto si e' in ritardo
	body: {
		type: String,
		required: true
	},

    /*
     * Una notifica puo' avere due nature: 
     * la notifica prima dell'inizio di un evento ("advance"),
     * oppure la notifica dopo la scadenza di un'attivita' ("ripetition"),
     * e non puo' essere entrambe allo stesso tempo.
     */
	mod: {
		type: String,
		required: true
	},
	
	//In caso di notifica che si deve ripetere
	ripetition: Number,
	counter: Number,

    //Quando verra' mandata la notifica
	time: {
		type: Date,
		required: true
	},

    /*
     * Memorizzo nel documento stesso i dati che mi vengono forniti in input,
     * che poi verranno convertiti nei parametri di sopra,
     * in questo modo sara' piu' facile ripescare i dati delle notifiche
     * quando in EventModal.js l'utente deve modificare un evento gia'
     * esistente, senza dover riconvertire il tutto.
     */
	rawData: {
		mod: String,
		advance: {
			minutes: Number,
			hours: Number,
			days: Number,
			weeks: Number,
			months: Number
		},
		ripetition: {
		    howMany: Number,
		    minutes: Number,
		    hours: Number,
		    days: Number
		}
	}
}, {
	collection: 'notifs', //Modifica il nome della collezione
	timestamps: true, //Aggiunge automaticamente "createdAt" e "updatedAt"
});

const Notification = mongoose.model('Notification', NotifSchema);

//Funzioni che si possono usare in file esterni
module.exports = {
     /*
	 * Crea una nuova notifica
	 * @param notif: Object, l'oggetto con i dati della notifica
	 * returns: Object, il nuovo documento della collezione
	 */
	new_notif: async (notif) => {
		const newnotif = new Notification(notif);
		return newnotif.save();
	},

	/*
	 * Applica lo snooze a una notifica mandata, quindi ne crea una nuova
	 * @param notif: Object, copia aggiornata della notifica appena 
	 * eliminata perchè mandata
	 * @param snooze: Integer, quanti minuti posticipare la notifica
	 * returns: Object, la nuova notifica del db
	 */
	applySnooze: async (notif) => {
		const newnotif = new Notification(notif);
		return newnotif.save();
	},

    /*
	 * Trova le notifiche di un certo evento
	 * @param event: String, l'id mongoose dell'evento
	 * returns: [Object], l'array delle notifiche trovate
	 */
	findByEvent: async (event) => {
		return await Notification.find({ event });
	},
    
    /*
     * Trova le notifiche da mandare adesso
     * returns: [Object], l'array delle notifiche da mandare
     */
	findCurrentPendings: async () => {
	    //Calcolo 'adesso'
		const now = new Date().setSeconds(0, 0);
		return await Notification.find({  time: now });
	},
    
    /*
     * Elimina una notifica specfica
     * @param id: String, l'id mongoose della notifica,
     * returns: Object, la notifica eliminata dal db
     */
	deleteNotif: async (id) => {
		return await Notification.deleteOne({_id: id});
	},

    /*
     * Elimina tutte le notifiche di un certo evento
     * @param event: String, l'id mongoose dell'evento,
     * returns: [Object], l'array delle notifiche eliminate dal db
     */
	deleteByEvent: async(event) => {
		return await Notification.deleteMany({ event });
	}
};
