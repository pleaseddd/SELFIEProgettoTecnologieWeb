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
  // crea un nuovo utente
  POST_new: async function (req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });

      if (user) res.status(401).json({ message: "Usa un'altra email!" });
      else {
        const newUser = new User({
          name,
          email,
          password,
          propic: "https://dummyimage.com/80x80/023430/fff.jpg&text=propic",
        });

        await newUser.save();
        res.status(201).json(newUser);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // GESTIONE SESSIONE DEL LOGIN
  POST_authLogin: async function (req, res) {
    try {
      
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.checkpw(password)))
        return res.status(401).json({ message: "Credenziali non valide" });
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Arrivato qui");
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Login riuscito" });
    } catch (err) {
      res.status(500).json({ message: "Errore del server" });
    }
  },
  GET_authMe: async function (req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Non autenticato" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ message: "Utente non trovato" });

      res.status(200).json(user);
    } catch (err) {
      res.status(401).json({ message: "Token non valido" });
    }
  },

  POST_authLogout: function (req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout effettuato" });
  },

  // FINE GESTIONE SESSIONE DEL LOGIN

  // per modificare le impostazioni
  POST_settings: async function (req, res) {
    try {
      const filter = { _id: req.body.user.id };
      const update = {
        $set: {
          name: req.body.user.name,
          email: req.body.user.email,
          settings: req.body.user.settings,
        },
      };
      const user = await User.findOneAndUpdate(filter, update);

      res.status(201).json({ message: "Impostazioni cambiate con successo" });
    } catch (error) {
      res.status(500).json({ error: "errore nel cambiaere le impostazioni" });
    }
  },

  findById: async (id) => {
    return await User.findById(id);
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

  POST_updateUser: async (req, res) => {
    const user = await User.findById(req.body.user_id);
    res.status(201).json(user);
  },
};


