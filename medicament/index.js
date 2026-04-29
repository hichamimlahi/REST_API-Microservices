const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Medicament = require("./Medicament");

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://db:27017/db_medicament")
    .then(() => {
        console.log(`Medicament-Service DB Connected`);
    })
    .catch((err) => {
        console.error(err);
    });

app.post("/medicament/ajouter", (req, res, next) => {
    const { nom_commercial, molecule_active, categorie, prix_unitaire, quantite_stock, fournisseur, date_expiration, sur_ordonnance } = req.body;
    const newMedicament = new Medicament({
        nom_commercial,
        molecule_active,
        categorie,
        prix_unitaire,
        quantite_stock,
        fournisseur,
        date_expiration,
        sur_ordonnance
    });

    newMedicament.save()
        .then(medicament => res.status(201).json(medicament))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.get('/medicament/liste', (req, res, next) => {
    Medicament.find()
        .then(medicaments => res.status(200).json(medicaments))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.post('/medicament/acheter', (req, res, next) => {
    const { noms_commerciaux } = req.body;
    Medicament.find({nom_commercial: {$in: noms_commerciaux} })
        .then(medicaments => res.status(201).json(medicaments))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.listen(PORT, () => {
    console.log(`Medicament-Service at ${PORT}`);
});