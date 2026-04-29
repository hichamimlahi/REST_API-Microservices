const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4001;
const mongoose = require("mongoose");
const Ordonance = require("./Ordonance");
const isAuthenticated = require("./isAuthenticated");
const axios = require('axios');
const amqp = require('amqplib');

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
mongoose.connect("mongodb://db/ordonance-service")
    .then(() => {
        console.log(`Ordonance-Service DB Connected`);
    })
    .catch((err) => {
        console.error(err);
    });

function prixTotal(medicaments) {
    let total = 0;
    for (let t = 0; t < medicaments.length; ++t){
        total += medicaments[t].prix;
    }
    console.log("prix total : " + total);
    return total;
}

async function httpRequest(ids){
    try{
        const URL = "http://medicament:4000/medicament/acheter";
        const response = await axios.post(URL, { ids: ids}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return prixTotal(response.data);
    } catch(error){
        console.error(error);
        return 0;
    }
}

app.post("/ordonance/ajouter", isAuthenticated, async (req, res, next) => {
    const { ids } = req.body;
    httpRequest(req.body.ids).then(total => {
        const newOrdonance = new Ordonance({
            medicaments: ids,
            email_patient: req.user.email,
            prix_total: total
        });
        newOrdonance.save()
            .then(ordonance => {
                if (channel) {
                    const message = {
                        email_patient: ordonance.email_patient,
                        ordonance_id: ordonance._id,
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

app.listen(PORT, () => {
    console.log(`Ordonance-service at ${PORT}`);
});