const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Utilisateur = require("./Utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://db:27017/db_authentification")
    .then(() => {
        console.log(`Auth-Service DB Connected `);
    })
    .catch((err) => {
        console.error(err);
    });

app.use(cors());
app.use(express.json());

app.post("/auth/register", async (req, res) => {
    let { nom, prenom, email, mot_de_passe, role } = req.body;
    const userExists = await Utilisateur.findOne({ email });
    if (userExists) {
        return res.json({ message: "Cet utilisateur existe déjà" });
    } else {
        bcrypt.hash(mot_de_passe, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err, });
            } else {
                mot_de_passe = hash;
                const newUtilisateur = new Utilisateur({ nom, prenom, email, mot_de_passe, role });
                newUtilisateur.save()
                    .then(user => res.status(201).json(user))
                    .catch(error => res.status(400).json({ error: error.message || error }));
            }
        });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, mot_de_passe } = req.body;
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
        return res.json({ message: "Utilisateur introuvable" });
    } else {
        bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe).then(resultat => {
            if (!resultat) {
                return res.json({ message: "Mot de passe incorrect" });
            } else {
                const payload = { email, nom: utilisateur.nom, role: utilisateur.role };
                jwt.sign(payload, "secret", (err, token) => {
                    if (err) console.log(err);
                    else return res.json({ token: token });
                });
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(` Auth-Service at ${PORT}`);
});