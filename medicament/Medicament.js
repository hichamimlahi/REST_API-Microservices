const mongoose = require("mongoose");
const MedicamentSchema = mongoose.Schema({
    nom_commercial: String,
    molecule_active: String,
    categorie: String,
    prix_unitaire: Number,
    quantite_stock: Number,
    fournisseur: String,
    date_expiration: Date,
    sur_ordonnance: Boolean
});
module.exports = Medicament = mongoose.model("medicament", MedicamentSchema);