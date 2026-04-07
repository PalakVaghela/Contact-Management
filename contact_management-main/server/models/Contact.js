const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNo: { type: String, required: true, unique: true }, 
    email: { type: String },
    designation: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);