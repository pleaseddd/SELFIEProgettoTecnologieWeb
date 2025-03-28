const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
	propic: { type: String }
});

UserSchema.pre('save', async function(next) {
	try {
		if(!this.isModified('password'))
			return next;

		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);

		next();
	}
	catch(error) {
		next(error);
	}
});

UserSchema.methods.checkpw = async function(password) {
	try {
		return await bcrypt.compare(password, this.password);
	}
	catch(error) {
		throw new Error("La password non matcha :')");
	}
};

const User = mongoose.model('User', UserSchema);

// requests
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
			const user = await User.findOne({ email });

			if(user)
				res.status(401).json({message: "Usa un'altra email!"});
			else {
		        const newUser = new User({
	                name,
	                email,
	                password,
	                propic: "https://dummyimage.com/80x80/023430/fff.jpg&text=prova"
		        });

		        await newUser.save();
		        res.status(201).json(newUser);
			}
	    }
		catch (err) {
	        res.status(400).json({ message: err.message });
	    }
	},

	userPOST_login: async function(req, res) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if(user == null)
				res.status(401).json({message: "Utente non trovato"});
			else if(!(await user.checkpw(password)))
				res.status(401).json({message: "Password errata"});
			else
				res.status(200).json({message: "Successo!", user:user});
		}
		catch(err) {
			res.status(500).json({message: err.message});
		}
	}
};

