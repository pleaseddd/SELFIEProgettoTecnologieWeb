//Moduli interni per la manipolazione dei db
const notifs = require('../db/notifClass.js');
//Moduli di funzioni utili
const { Time, dateSubTime, datePlusTime } = require("./timeManager.js");

module.exports = {
	/*
	 * genera tutte le notifiche associate a un evento
	 * @param event: Object, l'evento di referimento
	 * @param notifsList: [Object], la lista delle notifiche da creare
	 * Le notifiche create sono salvate sul db quindi non restituisce nulla
	 */
	generateNotifs: async (event, notifsList) => {
		notifsList.forEach(async (notif) => {
			const mod = notif.mod;

			//Si distinguono le notifiche per gli eventi e quelle per le attività
			if(mod == "advance") {
				const time = new Time(notif.advance);
				const refDate = new Date(event.begin);
				const sendDate = dateSubTime(refDate, time);
				await notifs.new_notif({
					event: event._id,
					title: event.title,
					body: time.toString(mod),
					mod,
					time: sendDate,
					rawData: notif
				});
			}
			if(mod == "ripetition") {
				const {howMany, ...timeUnits} = notif.ripetition;	
				const time = new Time(timeUnits);	
				let sendDate = new Date(event.end);
				for(let i=0; i<howMany; i++) {
					await notifs.new_notif({
						event: event._id,
						title: event.title,
						body: time.toString(mod),
						mod,
						ripetition: howMany,
						counter: i,
						time: sendDate,
						rawData: notif
					});
					sendDate = datePlusTime(sendDate, time);
				}
			}
		});
	}
};
