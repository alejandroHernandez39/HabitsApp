const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexion exitosa");
}).catch((err) => {
    console.log("Error");
    console.log(err);
});

module.exports = mongoose;