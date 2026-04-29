const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT_ONE || 4003;
const mongoose = require("mongoose");
const Personnel = require("./Personnel");

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://db:27017/db_personnel")
    .then(() => {
        console.log(`Personnel-Service DB Connected`);
    })
    .catch((err) => {
        console.error(err);
    });

app.post("/personnel/ajouter", (req, res, next) => {
    const { matricule, nom, prenom, poste, telephone, salaire_mensuel, date_embauche, est_actif } = req.body;
    const newPersonnel = new Personnel({
        matricule,
        nom,
        prenom,
        poste,
        telephone,
        salaire_mensuel,
        date_embauche,
        est_actif
    });

    newPersonnel.save()
        .then(personnel => res.status(201).json(personnel))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.get("/personnel/liste", (req, res, next) => {
    Personnel.find()
        .then(personnel => res.status(200).json(personnel))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.listen(PORT, () => {
    console.log(`Personnel-Service at ${PORT}`);
});