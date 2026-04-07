const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true }, //PK
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin','Intern', 'Jr. Developer', 'Sr. Developer'], 
        required: true 
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }], 
    permissions: {
        edit: Boolean,
        delete: Boolean,
      },

})


module.exports = mongoose.model("User", userSchema);