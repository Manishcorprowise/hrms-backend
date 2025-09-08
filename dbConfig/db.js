const { default: mongoose } = require("mongoose");
const config = require('../config');

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.database.mongodb.uri, config.database.mongodb.options);
        console.log(config.messages.error.databaseConnected);
    } catch (error) {
        console.log(config.messages.error.databaseError, error);
    }
};

module.exports = { connectDatabase };