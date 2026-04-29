const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Medicament = require("./Medicament");

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://db/medicament-service")
    .then(() => {
        console.log(`Medicament-Service DB Connected`);
    })
    .catch((err) => {
        console.error(err);
    });

app.post("/medicament/ajouter", (req, res, next) => {
    const { nom, description, prix, stock } = req.body;
    const newMedicament = new Medicament({
        nom,
        description,
        prix,
        stock
    });

    newMedicament.save()
        .then(medicament => res.status(201).json(medicament))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.post('/medicament/acheter', (req, res, next) => {
    const {ids} = req.body;
    Medicament.find({_id: {$in: ids} })
        .then(medicaments => res.status(201).json(medicaments))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.listen(PORT, () => {
    console.log(`Medicament-Service at ${PORT}`);
});