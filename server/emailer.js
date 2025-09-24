const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const usersdb = require('./db/usersClass.js');

const test = true;
require('dotenv').config({ path: __dirname + "/.env" + (test?'_test':'') });

(async () => {
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

	(async () => {
	  const info = await transporter.sendMail({
	    from: 'Il tuo calendario personale',
	    to: "amaduccisamuele@gmail.com",
	    subject: "Hello ✔",
	    text: "Hello world?", // plain‑text body
	    html: "<b>Hello world?</b>", // HTML body
	  });

	  console.log("Message sent:", info.messageId);
	})();
})();


