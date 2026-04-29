const axios = require('axios');

async function testServices() {
    try {
        console.log("=== Début des tests des microservices ===");

        // 1. Tester l'Authentification (Port 5002)
        console.log("\n[1] Création d'un utilisateur...");
        const registerRes = await axios.post('http://localhost:5002/auth/register', {
            nom: "Test User",
            email: "test@example.com",
            mot_passe: "password123"
        });
        console.log("Réponse Register:", registerRes.data);

        console.log("\n[2] Connexion de l'utilisateur...");
        const loginRes = await axios.post('http://localhost:5002/auth/login', {
            email: "test@example.com",
            mot_passe: "password123"
        });
        console.log("Réponse Login:", loginRes.data);
        const token = loginRes.data.token;

        if (!token) {
            throw new Error("Impossible de récupérer le token JWT");
        }

        // 2. Tester le service Médicament (Port 5000)
        console.log("\n[3] Ajout d'un médicament...");
        const medRes = await axios.post('http://localhost:5000/medicament/ajouter', {
            nom: "Paracétamol",
            description: "Analgésique et antipyrétique",
            prix: 5,
            stock: 100
        });
        console.log("Réponse Médicament:", medRes.data);
        const medicamentId = medRes.data._id;

        // 3. Tester le service Ordonnance (Port 5001)
        console.log("\n[4] Création d'une ordonnance...");
        const ordRes = await axios.post('http://localhost:5001/ordonance/ajouter', 
            { ids: [medicamentId] },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Réponse Ordonnance:", ordRes.data);

        // 4. Tester le service Personnel (Port 5003)
        console.log("\n[5] Ajout d'un membre du personnel...");
        const persoRes = await axios.post('http://localhost:5003/personnel/ajouter', {
            nom: "Dr. Dupont",
            role: "Médecin",
            salaire: 5000
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
