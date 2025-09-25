module.exports = {
	setEndpoints: (router) => {
		router.post('/api/notifs/snooze', POST_snooze);
	}
};

async function POST_snooze(req, res) {
	console.log("snooze");
}
