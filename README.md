# 🏥 Pharmacy Management System - Microservices Architecture

This project is a pharmacy management system based on a **Microservices** architecture. It provides centralized management for medications, prescriptions, pharmacy personnel, and user authentication, along with an integrated asynchronous notification system.

## 🚀 Technologies Used

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Message Broker**: RabbitMQ (for asynchronous communication between services)
*   **Frontend**: HTML, CSS, JavaScript (Vanilla), served by Nginx
*   **Containerization**: Docker, Docker Compose

## 🏗️ Microservices Architecture

The system is divided into several independent containerized microservices using Docker, communicating with each other either synchronously (REST API) or asynchronously (RabbitMQ).

| Service | External Port | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| **Authentication** | `5002` | User management (registration, login) and JWT token generation (`bcryptjs`, `jsonwebtoken`). | MongoDB |
| **Medicament (Medication)** | `5000` | Medication inventory management (CRUD). | MongoDB |
| **Ordonance (Prescription)** | `5001` | Medical prescription management. Communicates with Authentication and Medicament services. | MongoDB, RabbitMQ, Auth, Medicament |
| **Personnel (Staff)** | `5003` | Pharmacy staff management. | MongoDB |
| **Notification** | *Internal* | Asynchronous service listening to RabbitMQ events to trigger notifications. | RabbitMQ |
| **Frontend** | `8080` | Web user interface (Vanilla HTML/JS Single Page Application) communicating with backend APIs. | Nginx |
| **Database** | `27017` | Centralized MongoDB instance. | - |
| **RabbitMQ** | `5672` | Message broker for inter-service communication. (Management UI: `15672`) | - |

## 📋 Prerequisites

To run this project locally, you must have the following installed:
*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## 🛠️ Installation and Setup

The entire application is orchestrated using Docker Compose, which greatly simplifies the deployment process.

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <your-repository-url>
    cd Projet
    ```

2.  **Run the application with Docker Compose**:
    At the root of the project (where the `docker-compose.yml` file is located), run the following command:
    ```bash
    docker-compose up --build
    ```
    *The `--build` flag forces the rebuilding of Docker images to ensure the latest code changes are applied.*

3.  **Access the application**:
    *   **Web Frontend**: Open your browser and navigate to [http://localhost:8080](http://localhost:8080)
    *   **RabbitMQ Management UI**: [http://localhost:15672](http://localhost:15672) *(default credentials: guest/guest)*

4.  **Stop the application**:
    ```bash
    docker-compose down
    ```

## 📂 Project Structure

```text
Projet/
├── authentification/   # Source code for the authentication service
├── frontend/           # Static user interface (index.html, css, js)
├── medicament/         # Source code for the medication management service
├── notification/       # Source code for the notification service (RabbitMQ consumer)
├── ordonance/          # Source code for the prescription management service
├── personnel/          # Source code for the personnel management service
├── docker-compose.yml  # Docker orchestration file
└── test.js             # Global test file
```

## 🔗 Main API Endpoints (Examples)

*(These URLs are accessible from your local machine when the containers are running)*

*   **Auth Service**: `http://localhost:5002/api/...`
*   **Medicament Service**: `http://localhost:5000/api/...`
*   **Ordonnance Service**: `http://localhost:5001/api/...`
*   **Personnel Service**: `http://localhost:5003/api/...`

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
