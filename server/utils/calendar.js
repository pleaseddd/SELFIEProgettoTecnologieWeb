const notifs = require('../db/notifClass.js');
const { Time, dateSubTime } = require("./timeManager.js");

module.exports = {
	generateNotifs: async (event, notifsList) => {
		notifsList.forEach(async (notif) => {
			if(notif.advance) {
				const time = new Time(notif.advance);
				const refDate = new Date(event.begin);
				const sendDate = dateSubTime(refDate, time);
				await notifs.new_notif({
					event: event._id,
					title: event.title,
					body: time.toString(),
					time: sendDate,
					rawData: notif
				});
			}
		});
	}
};
