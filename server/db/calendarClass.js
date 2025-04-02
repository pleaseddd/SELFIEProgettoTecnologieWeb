const mongoose = require("mongoose");

const EventSchema =  new mongoose.Schema(
	{
    	title: {
			type: String,
			required: true,
			trim: true
		},

	    category: {
			type: String,
			required: true
		},

	    author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		begin: { Date },

		end: { Date }

		location: {
			type: String,
			required: false,
			trim: true
		},

	    repetition: {
			frequency: {
				type: String,
				enum: ["daily", "weekly", "monthly", "yearly"],
			},
			until: Date
		}
	},

	// Aggiunge automaticamente "createdAt" e "updatedAt"
  	{ timestamps: true }
);

const Event = mongoose.model("Event", Eventschema);

// richieste
module.exports = {
   
}
