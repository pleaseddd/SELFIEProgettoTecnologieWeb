const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// CRUD
module.exports = {
    userGET: async function(req, res) {
	    try {
			const users = await User.find();
	        	res.json(users);
		}
		catch (err) {
	    	res.status(500).json({ message: err.message });
		}
	},

	userPOST_new: async function(req, res) {
		try {
	        const { name, email, password } = req.body;
	        const newUser = new User({
                name,
                email,
                password
	        });
	        await newUser.save();
	        res.status(201).json(newUser);
	    }
		catch (err) {
	        res.status(400).json({ message: err.message });
	    }
	},

	userPOST_login: async function(req, res) {
		console.log("qui");
		try {
			console.log(JSON.stringify(req.body));
			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if(user == null) {
				res.status(401).json({message: "Utente non trovato"});
			}
			else if(password != user.password) {
				res.status(401).json({message: "Password errata"});
			}
			else {
				res.status(200).json({message: "Successo!"});
			}
		}
		catch(err) {
			res.status(500).json({message: err.message});
		}
	}
};

