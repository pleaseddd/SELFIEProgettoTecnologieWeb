const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  propic: {
    type: String,
    default: "https://dummyimage.com/80x80/023430/fff.jpg&text=not a propic",
  },

  google: {
    isLogged: {
      type: Boolean,
      default: false,
    },

    tokens: {
      access_token: String,
      refresh_token: String,
    },

	calendarId: { type: String }
  },

  settings: {
    language: {
      type: String,
      default: "italian",
    },

    categoryNotes: {
      type: String,
      default: "appunti/todo",
    },

    categoryEvents: {
      type: String,
      default: "studio/lavoro/sport",
    },

    theme: {
      type: Boolean,
      default: false, // false chiaro, true scuro
    },

    startDay: {
      type: Boolean,
      default: false, // false lunedì, true domenica
    },

    position: {
      type: String,
      default: "world",
    },

    homeNotes: {
      type: Number,
      default: 3,
    },
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.checkpw = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("La password non matcha :')");
  }
};

const User = mongoose.model("User", UserSchema);

// richieste
module.exports = {
  newUser: async (user) => {
    const newuser = new User(user);
	return await newuser.save();
  },

  findBy: async (filter) => {
    if(filter.hasOwnProperty("id"))
	    return await User.findById(filter.id);
    if(filter.hasOwnProperty('email'))
		return await User.findOne(filter);
  },

  update: async (filter, update) => {
	return await User.findOneAndUpdate(filter, update);
  },

  updateGoogleTokens: async (email, tokens) => {
    const filter = { email };
    const update = { $set: { google: { isLogged: true, tokens } } };

    return await User.findOneAndUpdate(filter, update);
  },

  googleLogout: async (id) => {
    const filter = { _id: id };
    const update = { $set: { google: { isLogged: false, tokens: {} } } };

    return await User.findOneAndUpdate(filter, update);
  },

  setGoogleCal: async (userid, calid) => {
	const filter = { _id: userid };
	const update = { $set: { 'google.calendarId': calid } };
	return await User.findOneAndUpdate(filter, update);
  },
};


