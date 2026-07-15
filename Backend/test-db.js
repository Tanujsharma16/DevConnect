require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected");
        console.log(conn.connection.host);
    } catch (err) {
        console.error(err);   // <-- poora error
    }
})();