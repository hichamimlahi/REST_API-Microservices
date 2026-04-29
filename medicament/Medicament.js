const mongoose = require("mongoose");
const MedicamentSchema = mongoose.Schema({
    nom: String,
    description: String,
    prix: Number,
    stock: Number
});
module.exports = Medicament = mongoose.model("medicament", MedicamentSchema);