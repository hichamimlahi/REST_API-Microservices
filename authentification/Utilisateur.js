const mongoose = require("mongoose");
const UtilisateurSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mot_de_passe: String,
    role: String,
    date_creation: {
        type: Date,
        default: Date.now,
    },
});
module.exports = Utilisateur = mongoose.model("utilisateur", UtilisateurSchema);