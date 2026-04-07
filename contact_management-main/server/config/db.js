const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    const dbURL = process.env.MONGODB_URL;


    mongoose.connect(dbURL, {
           
        })
        .then(() => console.log("DB Connected Successfully"))
        .catch((error) => {
            console.log("DB Connection Failed");
            console.error("Error:", error.message);
            process.exit(1);
        });
};