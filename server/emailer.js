const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + "/.env" + (test?'_test':'') });


const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: "amaduccisamuele@gmail.com",
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		refresh
	}
})
