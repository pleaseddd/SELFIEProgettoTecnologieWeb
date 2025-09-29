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
				const transporter = nodemailer.createTransport({
					host: "smtp.gmail.com",
					port: 465,
					secure: true,
					auth: {
						type: "OAuth2",
						user: process.env.GMAIL_SITE_ADDRESS,
						clientId: process.env.GOOGLE_CLIENT_ID,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET,
						refreshToken: process.env.GMAIL_SITE_REFRESH_TOKEN
					}
				});

				const user = await usersdb.findBy({ id: notif.user });
				await transporter.sendMail({
					from: 'me',
					to: user.google.gmail.address,
					subject: `Notifica per l'evento "${notif.title}"`,
					html: `<p>${notif.body} al tuo evento!</p>`
				});

				console.log('email mandata con successo');

			});
		});

		console.log("in ascolto per mandare notifiche");
	},

	Time: class Time {
		constructor(time) {
			const timeUnits = [
				'minutes',
				'hours',
				'days',
				'weeks',
				'months'
			];
			for(const timeUnit of timeUnits) {
				if(time.hasOwnProperty(timeUnit))
					this[timeUnit] = parseInt(time[timeUnit]);
			}
		}

		toString() {
			let res = [];

			const oneOrMore = (count, charOpts) => {
				if(count == 1)
					return charOpts[0];
				else
					return charOpts[1];
			};

			if(this.months)
				res.push(`${this.months} mes${oneOrMore(this.months, 'ei')}`);
			if(this.weeks)
				res.push(`${this.weeks} settiman${oneOrMore(this.weeks, 'ae')}`);
			if(this.days)
				res.push(`${this.days} giorn${oneOrMore(this.days, 'oi')}`);
			if(this.hours)
				res.push(`${this.hours} or${oneOrMore(this.hours, 'ae')}`);
			if(this.minutes)
				res.push(`${this.minutes} minut${oneOrMore(this.minutes, 'oi')}`);

			if(res.length <= 1)
				return (res[0].substring(0, 2) == '1 ' ? "Manca " : "Mancano ") + res[0];
			else
				return "Mancano " + res.slice(0, -1).join(', ') + ' e ' + res.slice(-1);
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
