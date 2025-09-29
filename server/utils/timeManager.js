const cron = require("node-cron");
const webpush = require('web-push');
const nodemailer = require('nodemailer');

const notifs = require('../db/notifClass.js');
const swsubs = require('../db/swsubsClass.js');
const usersdb = require('../db/usersClass.js');
const calendardb = require('../db/calendarClass.js');

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
				const event = await calendardb.findBy({ id: notif.event });
				const subs = await swsubs.findBy({ user: event.author });

				subs.forEach(async (sub) => {
					await webpush.sendNotification(
						sub, JSON.stringify( {title: notif.title, body: notif.body })
					);
				});

				await notifs.deleteNotif(notif._id);
				console.log("notifica mandata con successo");

				//sezione delle mail
				// const transporter = nodemailer.createTransport({
				// 	host: "smtp.gmail.com",
				// 	port: 465,
				// 	secure: true,
				// 	auth: {
				// 		type: "OAuth2",
				// 		user: process.env.GMAIL_SITE_ADDRESS,
				// 		clientId: process.env.GOOGLE_CLIENT_ID,
				// 		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				// 		refreshToken: process.env.GMAIL_SITE_REFRESH_TOKEN
				// 	}
				// });
    //
				// const user = await usersdb.findBy({ id: notif.user });
				// await transporter.sendMail({
				// 	from: 'me',
				// 	to: user.google.gmail.address,
				// 	subject: `Notifica per l'evento "${notif.title}"`,
				// 	html: `<p>${notif.body} al tuo evento!</p>`
				// });
    //
				// console.log('email mandata con successo');

			});
		});

		console.log("in ascolto per mandare notifiche");
	},

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

		toString() {
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

			return resStr + '!';
		}
	},

	dateSubTime: (date, time) => {
		const MS_PER_MINUTE = 60000;
		const MS_PER_HOUR = MS_PER_MINUTE * 60;
		const MS_PER_DAY = MS_PER_HOUR * 24;
		const MS_PER_WEEK = MS_PER_DAY * 7;
		const MS_PER_MONTH = MS_PER_DAY * 30;

		const totalTime = (time?.minutes ?? 0) * MS_PER_MINUTE
			+ (time?.hours ?? 0) * MS_PER_HOUR
			+ (time?.days ?? 0) * MS_PER_DAY
			+ (time?.weeks ?? 0) * MS_PER_WEEK
			+ (time?.months ?? 0) * MS_PER_MONTH;

		return new Date(date.valueOf() - totalTime);
	}
};
