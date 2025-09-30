//Moduli esterni
const cron = require("node-cron");
const webpush = require('web-push');
const nodemailer = require('nodemailer');

//Moduli interni per la manipolazione dei database
const notifs = require('../db/notifClass.js');
const swsubs = require('../db/swsubsClass.js');
const usersdb = require('../db/usersClass.js');
const calendardb = require('../db/calendarClass.js');

//Numero di millisecondi per ogni unità di tempo
const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;
const MS_PER_MONTH = MS_PER_DAY * 30;

module.exports = {
	/*
	 * definisce la funzione di node-cron,
	 * la funzione che verrà richiamata ciclicamente
	 * e che serve per controllare se ci sono notifiche da mandare
	 */
	setCronFunc: () => {
		//Le credenziali per poter mandare le notifiche push
		webpush.setVapidDetails(
			"mailto:isabella.amaducci3@studio.unibo.it",
			process.env.VPKEY_PUBLIC,
			process.env.VPKEY_PRIVATE
		);

		cron.schedule('* * * * *', async () => {
			const pendings = await notifs.findCurrentPendings();
			pendings.forEach(async (notif) => {
				const event = await calendardb.findBy({ id: notif.event });
				const subs = await swsubs.findBy({ user: event.author });
				
				//Mando la stessa notifica a tutti i dispositivi registrati
				subs.forEach(async (sub) => {
					await webpush.sendNotification(sub, JSON.stringify(notif));
				});
				
				//E la elimino dal db
				await notifs.deleteNotif(notif._id);
			});
		});

		console.log("in ascolto per mandare notifiche");
	},

	/*
	 * Classe che serve per trasformare un insieme di unità
	 * di tempo in una stringa esteticamente piacevole
	 */
	Time: class Time {
		constructor(time) {
			this.timeUnits = [
				'minutes',
				'hours',
				'days',
				'weeks',
				'months'
			];
			for(const timeUnit of this.timeUnits) {
				if(time.hasOwnProperty(timeUnit))
					this[timeUnit] = parseInt(time[timeUnit]);
			}
		}

		toString(mod) {
			const oneOrMore = (n, str) =>
				n == 1 ? str[str.length-2] : str[str.length-1];

			let res = [];

			[
				'mesei',
				'settimanae',
				'giornoi',
				'orae',
				'minutoi'
			].map((t, i) => [this.timeUnits.toReversed()[i], t])
				.forEach(timeUnit => {;
					const [objProp, objStr] = timeUnit;
					if(this[objProp])
						res.push(
							this[objProp]
							+ ' ' + objStr.slice(0, -2)
							+ oneOrMore(this[objProp], objStr)
						);
				});
			
			let resStr;

			//Considero tutti i casi possibili
			if(mod=="advance") {
				if(res.length > 1) {
					resStr = "Mancano "
						+ res.slice(0, -1).join(', ')
						+ ' e '
						+ res.slice(-1);
				}
				else if(res[0].substring(0, 2) == '1 ')
					resStr = "Manca " + res[0];
				else
					resStr = "Mancano " + res[0];
			}
			else
				resStr = "Sei sempre più in ritardo";

			return resStr + '!';
		}
	},

	/*
	 * aggiunge del tempo a una data
	 * @param date: Date, la data di riferimento
	 * @param time: Time, le unità di tempo da aggiungere
	 * returns: Date, la nuova data
	 */
	datePlusTime: (date, time) => {
		const totalTime = (time?.minutes ?? 0) * MS_PER_MINUTE
			+ (time?.hours ?? 0) * MS_PER_HOUR
			+ (time?.days ?? 0) * MS_PER_DAY

		return new Date(date.valueOf() + totalTime);
	},	
	
	/*
	 * sottrae del tempo a una data
	 * @param date: Date, la data di riferimento
	 * @param time: Time, le unità di tempo da sottrarre
	 * returns: Date, la nuova data
	 */
	dateSubTime: (date, time) => {
		const totalTime = (time?.minutes ?? 0) * MS_PER_MINUTE
			+ (time?.hours ?? 0) * MS_PER_HOUR
			+ (time?.days ?? 0) * MS_PER_DAY
			+ (time?.weeks ?? 0) * MS_PER_WEEK
			+ (time?.months ?? 0) * MS_PER_MONTH;

		return new Date(date.valueOf() - totalTime);
	}
};
