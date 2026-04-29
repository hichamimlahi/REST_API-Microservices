const mongoose = require("mongoose");
const OrdonanceSchema = mongoose.Schema({
    numero_ordonnance: String,
    nom_patient: String,
    email_patient: String,
    nom_medecin: String,
    date_prescription: {
        type: Date,
        default: Date.now,
    },
    statut: String,
    medicaments_prescrits: [{
        nom_medicament: String,
        quantite: Number,
        posologie: String
    }],
    prix_total: Number
});
module.exports = Ordonance = mongoose.model("ordonance", OrdonanceSchema);