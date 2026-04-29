const axios = require('axios');

async function testServices() {
    try {
        console.log("=== Début des tests des microservices ===");

        // 1. Tester l'Authentification (Port 5002)
        console.log("\n[1] Création d'un utilisateur...");
        const registerRes = await axios.post('http://localhost:5002/auth/register', {
            nom: "Dupont",
            prenom: "Jean",
            email: "jean.dupont@example.com",
            mot_de_passe: "password123",
            role: "Patient"
        });
        console.log("Réponse Register:", registerRes.data);

        console.log("\n[2] Connexion de l'utilisateur...");
        const loginRes = await axios.post('http://localhost:5002/auth/login', {
            email: "jean.dupont@example.com",
            mot_de_passe: "password123"
        });
        console.log("Réponse Login:", loginRes.data);
        const token = loginRes.data.token;

        if (!token) {
            throw new Error("Impossible de récupérer le token JWT");
        }

        // 2. Tester le service Médicament (Port 5000)
        console.log("\n[3] Ajout d'un médicament...");
        const medRes = await axios.post('http://localhost:5000/medicament/ajouter', {
            nom_commercial: "Paracétamol 1000",
            molecule_active: "Paracétamol",
            categorie: "Antalgique",
            prix_unitaire: 5,
            quantite_stock: 100,
            fournisseur: "PharmaCorp",
            date_expiration: "2028-12-31",
            sur_ordonnance: false
        });
        console.log("Réponse Médicament:", medRes.data);

        // 3. Tester le service Ordonnance (Port 5001)
        console.log("\n[4] Création d'une ordonnance...");
        const ordRes = await axios.post('http://localhost:5001/ordonance/ajouter', 
            { 
                numero_ordonnance: "ORD-2026-1001",
                nom_patient: "Jean Dupont",
                email_patient: "jean.dupont@example.com",
                nom_medecin: "Dr. Martin",
                statut: "En attente",
                medicaments_prescrits: [
                    {
                        nom_medicament: "Paracétamol 1000",
                        quantite: 2,
                        posologie: "1 comprimé matin et soir"
                    }
                ]
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Réponse Ordonnance:", ordRes.data);

        // 4. Tester le service Personnel (Port 5003)
        console.log("\n[5] Ajout d'un membre du personnel...");
        const persoRes = await axios.post('http://localhost:5003/personnel/ajouter', {
            matricule: "EMP-001",
            nom: "Dupont",
            prenom: "Dr.",
            poste: "Médecin",
            telephone: "0102030405",
            salaire_mensuel: 5000,
            date_embauche: "2026-01-15",
            est_actif: true
        });
        console.log("Réponse Personnel (Ajout):", persoRes.data);

        console.log("\n[6] Liste du personnel...");
        const persoListRes = await axios.get('http://localhost:5003/personnel/liste');
        console.log("Réponse Personnel (Liste):", persoListRes.data);

        console.log("\n=== Tous les tests ont réussi ! ===");
    } catch (error) {
        console.error("\nErreur lors des tests:", error.response ? error.response.data : error.message);
    }
}

testServices();
