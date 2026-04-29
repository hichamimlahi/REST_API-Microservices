const mongoose = require("mongoose");
const PersonnelSchema = mongoose.Schema({
    nom: String,
    role: String,
    salaire: Number
});
module.exports = Personnel = mongoose.model("personnel", PersonnelSchema);