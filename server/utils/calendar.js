const notifs = require('../db/notifClass.js');
const { Time, dateSubTime } = require("./timeManager.js");

module.exports = {
	generateNotifs: async (event) => {
		const urgencyNotifs = {
			'urgente': [
				new Time({ days: 1 }),
				new Time({ hours: 12 }),
				new Time({ hours: 1 }),
				new Time({ minutes: 15 }),
			],

			'non troppo urgente': [
				new Time({ days: 1 }),
				new Time({ hours: 12 }),
				new Time({ hours: 1 })
			],

			'non urgente': [
				new Time({ days: 1 }),
				new Time({ hours: 1 })
			]
		};

		urgencyNotifs[event.urgency].forEach(async (time) => {
			const refDate = new Date(event.begin);
			const sendDate = dateSubTime(refDate, time);
			await notifs.new_notif({
				user: event.author,
				title: event.title,
				body: time.toString(),
				time: sendDate,
			});
		});
	}
};
