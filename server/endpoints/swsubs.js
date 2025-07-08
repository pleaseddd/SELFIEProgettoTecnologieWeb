module.exports = {
	setEndpoints: (router) => {
		router.post('/api/swsub/listsubs', POST_list);
		router.post('/api/swsub/get', POST_getswsub);
		router.post('/api/swsub/subscribe', POST_subscribe);
		router.post('/api/swsub/unsubscribe', POST_unsubscribe);
		router.post('/api/swsub/updatename', POST_updateswsubname);
	}
};

async function POST_list(req, res) {
	const subs = await Subscription.find({ user: req.body.user_id });
	res.status(201).json(subs);
}
