const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT_ONE || 4001;
const mongoose = require("mongoose");
const Ordonance = require("./Ordonance");
const isAuthenticated = require("./isAuthenticated");
const axios = require('axios');
const amqp = require('amqplib');

app.use(cors());
app.use(express.json());

let channel;
async function connectQueue() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        channel = await connection.createChannel();
        await channel.assertQueue('notifications', { durable: true });
        console.log("RabbitMQ Connected");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ, retrying...", error.message);
        setTimeout(connectQueue, 5000);
    }
}
connectQueue();

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://db:27017/db_ordonnance")
    .then(() => {
        console.log(`Ordonance-Service DB Connected`);
    })
    .catch((err) => {
        console.error(err);
    });

function prixTotal(medicamentsDb, medicaments_prescrits) {
    let total = 0;
    for (let i = 0; i < medicamentsDb.length; ++i) {
        const medDb = medicamentsDb[i];
        // Trouver la quantité demandée pour ce médicament
        const medPrescrit = medicaments_prescrits.find(m => m.nom_medicament === medDb.nom_commercial);
        if (medPrescrit) {
            total += medDb.prix_unitaire * medPrescrit.quantite;
        }
    }
    console.log("prix total calculé : " + total);
    return total;
}

async function httpRequest(medicaments_prescrits) {
    try {
        const noms_commerciaux = medicaments_prescrits.map(m => m.nom_medicament);
        const URL = "http://medicament:4000/medicament/acheter";
        const response = await axios.post(URL, { noms_commerciaux: noms_commerciaux }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return prixTotal(response.data, medicaments_prescrits);
    } catch(error) {
        console.error(error);
        return 0;
    }
}

app.post("/ordonance/ajouter", isAuthenticated, async (req, res, next) => {
    const { numero_ordonnance, nom_patient, email_patient, nom_medecin, statut, medicaments_prescrits } = req.body;
    
    httpRequest(medicaments_prescrits).then(total => {
        const newOrdonance = new Ordonance({
            numero_ordonnance,
            nom_patient,
            email_patient,
            nom_medecin,
            statut,
            medicaments_prescrits,
            prix_total: total
        });
        
        newOrdonance.save()
            .then(ordonance => {
                if (channel) {
                    const message = {
                        numero_ordonnance: ordonance.numero_ordonnance,
                        nom_patient: ordonance.nom_patient,
                        email_patient: ordonance.email_patient,
                        prix_total: ordonance.prix_total
                    };
                    channel.sendToQueue('notifications', Buffer.from(JSON.stringify(message)));
                    console.log("Notification envoyée à RabbitMQ");
                }
                res.status(201).json(ordonance);
            })
            .catch(error => res.status(400).json({ error: error.message || error }));
    });
});

app.get('/ordonance/liste', (req, res, next) => {
    Ordonance.find()
        .then(ordonances => res.status(200).json(ordonances))
        .catch(error => res.status(400).json({ error: error.message || error }));
});

app.listen(PORT, () => {
    console.log(`Ordonance-service at ${PORT}`);
});