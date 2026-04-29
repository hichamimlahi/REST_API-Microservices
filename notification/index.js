const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://rabbitmq:5672';
const QUEUE_NAME = 'notifications';

async function connectQueue() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        
        console.log(`[*] En attente de messages dans ${QUEUE_NAME}. Pour quitter faire CTRL+C`);

        channel.consume(QUEUE_NAME, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log(`[x] Nouvelle notification reçue :`);
                console.log(`    Destinataire : ${messageContent.email_patient}`);
                console.log(`    Message : Votre ordonnance ${messageContent.ordonance_id} a été créée avec succès.`);
                console.log(`    Prix Total : ${messageContent.prix_total} €`);
                
                // Simuler un envoi d'email
                setTimeout(() => {
                    console.log(`[v] Email envoyé avec succès à ${messageContent.email_patient} !`);
                    channel.ack(msg);
                }, 1000);
            }
        });
    } catch (error) {
        console.error("Erreur de connexion à RabbitMQ, nouvelle tentative dans 5 secondes...", error.message);
        setTimeout(connectQueue, 5000);
    }
}

connectQueue();
