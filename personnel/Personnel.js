const mongoose = require("mongoose");
const PersonnelSchema = mongoose.Schema({
    matricule: String,
    nom: String,
    prenom: String,
    poste: String,
    telephone: String,
    salaire_mensuel: Number,
    date_embauche: Date,
    est_actif: Boolean
});
module.exports = Personnel = mongoose.model("personnel", PersonnelSchema);