# 🏥 Pharmacy Management System - Microservices Architecture

This project is a comprehensive pharmacy management system built upon a **Microservices Architecture**. It provides centralized and independent management for medications, medical prescriptions, pharmacy personnel, and user authentication, complemented by an integrated asynchronous notification system using RabbitMQ.

## 🚀 Technologies & Stack

*   **Backend Framework**: Node.js, Express.js
*   **Database**: MongoDB (NoSQL document database)
*   **Message Broker**: RabbitMQ (Enables asynchronous event-driven communication between services)
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **Frontend**: HTML, CSS, JavaScript (Vanilla), served by Nginx
*   **Containerization & Orchestration**: Docker, Docker Compose

---

## 🧠 Core Technical Concepts & Decisions

To ensure the system is scalable, maintainable, and modern, several key technical choices were made:

### 🐳 Docker & Containerization
Microservices are inherently complex to deploy because there are many moving parts. **Docker** solves this by packaging each service (Auth, Medicament, Ordonance, etc.) into its own isolated container with its own dependencies (Node.js version, libraries). 
*   **Environment Consistency**: "It works on my machine" is no longer an issue; the code runs exactly the same way in development, testing, and production.
*   **Docker Compose**: We use `docker-compose.yml` as the orchestrator. With a single command (`docker-compose up`), we spin up 8 different containers (6 custom services + MongoDB + RabbitMQ) connected to the same internal network, seamlessly linking them together.

### 🍃 NoSQL with MongoDB
In a modern pharmacy system, data structures can evolve rapidly. **MongoDB** was chosen as the primary database for several reasons:
*   **Schema Flexibility**: Unlike relational SQL databases, MongoDB allows us to store varied data structures. For example, a prescription (Ordonance) can contain a dynamic array of different medications, dosages, and patient notes without requiring complex JOIN tables.
*   **JSON/BSON Native**: Since our microservices are built in Node.js, data naturally flows in JSON format. MongoDB stores data as BSON (Binary JSON), making the transition from frontend to backend to database frictionless.

### 🔐 Stateless Authentication with JWT
In a monolithic application, user sessions are often stored in memory. In a Microservices Architecture, this is impossible because requests are routed to different independent servers. We use **JSON Web Tokens (JWT)** to solve this:
*   **Statelessness**: When a user logs in, the `Authentification` service verifies the credentials and returns a signed JWT. This token contains the user's identity and role.
*   **Decentralized Security**: The frontend attaches this token to the header (`Authorization: Bearer <token>`) of subsequent requests. Services like `Ordonance` can instantly verify the token's validity without needing to query a shared session database, keeping the architecture truly decoupled and fast.

---

## 🏗️ Microservices Architecture Detail

The application is decomposed into isolated containerized services. This design pattern ensures high availability, independent scalability, and separation of concerns.

| Service | External Port | Internal Port | Description & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Authentication** | `5002` | `4002` | Manages user registration, login verification, password hashing (`bcryptjs`), and issues JWT tokens (`jsonwebtoken`) for secure API access. |
| **Medicament** | `5000` | `4000` | Handles the pharmacy's inventory. Performs CRUD operations on medications (stock, pricing, expiration dates). |
| **Ordonance** | `5001` | `4001` | Manages medical prescriptions. Validates JWT tokens with the Auth service, verifies medication existence, and publishes events to RabbitMQ. |
| **Personnel** | `5003` | `4003` | Manages pharmacy staff records (doctors, pharmacists, etc.), including salaries, roles, and hiring dates. |
| **Notification** | *None* | *Internal* | An asynchronous background worker that subscribes to RabbitMQ queues and processes events (e.g., sending an email when a prescription is validated). |
| **Frontend** | `8080` | `80` | A Vanilla SPA (Single Page Application) acting as the UI, communicating with backend microservices via REST API calls. |

---

## 📋 Prerequisites

To run this project locally, ensure you have the following tools installed on your machine:
*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   [Node.js](https://nodejs.org/en/) *(Only required if you want to run the local `test.js` script)*

---

## 🛠️ Installation and Setup

The entire infrastructure, including databases and message brokers, is orchestrated using Docker Compose.

1.  **Clone the repository**:
    ```bash
    git clone <your-repository-url>
    cd Projet
    ```

2.  **Start the infrastructure**:
    Run the following command at the root of the project to build the images and start all containers in the background:
    ```bash
    docker-compose up --build -d
    ```

3.  **Access the interfaces**:
    *   **Pharmacy Web Dashboard**: [http://localhost:8080](http://localhost:8080)
    *   **RabbitMQ Management Interface**: [http://localhost:15672](http://localhost:15672) *(Credentials: `guest` / `guest`)*
    *   **MongoDB Database**: `localhost:27017`

4.  **Stop the infrastructure**:
    To gracefully stop and remove the containers:
    ```bash
    docker-compose down
    ```

---

## 🔗 Detailed API Endpoints & Usage

Below is a breakdown of the core REST API endpoints exposed by the microservices. 

### 1. Authentication Service (`Port 5002`)
*   **`POST /auth/register`**: Register a new user.
    *   *Payload*: `{ "nom": "Dupont", "prenom": "Jean", "email": "jean@example.com", "mot_de_passe": "password", "role": "Patient" }`
*   **`POST /auth/login`**: Authenticate a user and receive a JWT.
    *   *Payload*: `{ "email": "jean@example.com", "mot_de_passe": "password" }`
    *   *Returns*: `{ "token": "eyJhbGciOiJIUz..." }`

### 2. Medicament Service (`Port 5000`)
*   **`POST /medicament/ajouter`**: Add a new medication to the inventory.
    *   *Payload*: `{ "nom_commercial": "Paracetamol", "quantite_stock": 100, "prix_unitaire": 5, ... }`
*   **`GET /medicament/liste`**: Retrieve the list of all medications.

### 3. Ordonance Service (`Port 5001`)
*Requires JWT Token in Headers: `Authorization: Bearer <token>`*
*   **`POST /ordonance/ajouter`**: Create a new prescription. Triggers a RabbitMQ event upon success.
    *   *Payload*: `{ "numero_ordonnance": "ORD-001", "nom_patient": "Jean", "medicaments_prescrits": [...] }`

### 4. Personnel Service (`Port 5003`)
*   **`POST /personnel/ajouter`**: Hire/Add a new staff member.
    *   *Payload*: `{ "matricule": "EMP-001", "nom": "Dr. Martin", "poste": "Médecin", ... }`
*   **`GET /personnel/liste`**: Get all active personnel.

---

## 🧪 Automated Testing

A global end-to-end test script (`test.js`) is provided at the root of the project. It uses `axios` to simulate a complete user journey across all microservices (Register -> Login -> Add Medication -> Create Prescription -> Add Personnel).

To run the test suite:
1. Ensure your Docker containers are running (`docker-compose up -d`).
2. Open a terminal at the root of the project.
3. Install axios (if not installed globally): `npm install axios`
4. Execute the script:
   ```bash
   node test.js
   ```
*If successful, the terminal will output "=== Tous les tests ont réussi ! ===".*

---

## 📂 Project Structure

```text
Projet/
├── authentification/   # Auth microservice source code (Node.js/Express)
├── frontend/           # Static SPA (HTML, CSS, JS) served by Nginx
├── medicament/         # Medication microservice source code
├── notification/       # Async notification worker (RabbitMQ consumer)
├── ordonance/          # Prescription microservice source code
├── personnel/          # Personnel management microservice
├── docker-compose.yml  # Docker orchestration and networking config
└── test.js             # E2E integration test script
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request
