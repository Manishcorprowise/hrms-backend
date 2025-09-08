const { default: mongoose } = require("mongoose");


const connectDatabase = async () => {
    try {
        const url = "mongodb://localhost:27017/hrmsDB";
        await mongoose.connect(url);
        console.log("database connected");
    } catch (error) {
        console.log("somthing went wrong while connecting to database", error);
    }
};

module.exports = { connectDatabase };