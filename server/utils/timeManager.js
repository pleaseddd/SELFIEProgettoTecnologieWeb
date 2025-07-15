const cron = require("node-cron");
const webpush = require('web-push');
const notifs = require('../db/notifClass.js');
const swsubs = require('../db/swsubsClass.js');
require('dotenv').config({ path: __dirname + '/../.env' });

module.exports = {
	setCronFunc: () => {
		webpush.setVapidDetails(
			"mailto:isabella.amaducci3@studio.unibo.it",
			process.env.VPKEY_PUBLIC,
			process.env.VPKEY_PRIVATE
		);

		cron.schedule('* * * * *', async () => {
			const pendings = await notifs.findCurrentPendings();

			pendings.forEach(async (notif) => {
				const subs = await swsubs.findBy({ user: notif.user});
				subs.forEach(async (sub) => {
					await webpush.sendNotification(
						sub, JSON.stringify( {title: notif.title, body: notif.body })
					);
				});

				await notifs.notif_sent(notif._id);

				console.log("notifica mandata con successo");
			});
		});

		console.log("in ascolto per mandare notifiche");
	},

	Time: class Time {
		constructor(time) {
			const params = ['minutes', 'hours', 'days'];
			for(const key of params) {
				if(time.hasOwnProperty(key))
					this[key] = time[key];
			}
		}

		toString() {
			let res = [];

			if(this.days)
				res.push(`${this.days} ${this.days > 1 ? 'giorni' : 'giorno'}`);
			if(this.hours)
				res.push(`${this.hours} ${this.hours > 1 ? 'ore' : 'ora'}`);
			if(this.minutes)
				res.push(`${this.minutes} ${this.minutes > 1 ? 'minuti' : 'minuto'}`);

			if(res.length <= 1)
				return (res[0].substring(0, 2) == '1 ' ? "Manca " : "Mancano ") + res[0];
			else
				return res.slice(0, -1).join(', ') + ' e ' + res.slice(-1);
		}
	},

	dateSubTime: (date, time) => {
		const MS_PER_MINUTE = 60000;
		const MS_PER_HOUR = MS_PER_MINUTE * 60;
		const MS_PER_DAY = MS_PER_HOUR * 24;

		const totalTime = (time?.minutes ?? 0) * MS_PER_MINUTE
			+ (time?.hours ?? 0) * MS_PER_HOUR
			+ (time?.days ?? 0) * MS_PER_DAY;

		return new Date(date.valueOf() - totalTime);
	}
};
