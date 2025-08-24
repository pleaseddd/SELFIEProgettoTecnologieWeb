const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const usersdb = require('./db/usersClass.js');

const test = true;
require('dotenv').config({ path: __dirname + "/.env" + (test?'_test':'') });

(async () => {
	await mongoose.connect(process.env.MONGO_URL);
	console.log("database connesso");
	const user = await  usersdb.findBy({ email: 'prova1@gmail.com' });
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			type: "OAuth2",
			user: "amaduccisamuele@gmail.com",
			accessToken: user.google.tokens.access_token
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


