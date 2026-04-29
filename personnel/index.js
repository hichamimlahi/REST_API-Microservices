const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4003;
const mongoose = require("mongoose");
const Personnel = require("./Personnel");

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://db/personnel-service")
    .then(() => {
        console.log(`Personnel-Service DB Connected`);
    })
    .catch((err) => {
        console.error(err);
    });

app.post("/personnel/ajouter", (req, res, next) => {
    const { nom, role, salaire } = req.body;
    const newPersonnel = new Personnel({
        nom,
        role,
        salaire
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