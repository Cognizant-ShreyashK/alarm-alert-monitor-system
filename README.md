# Real Time Alert - Monitor System

A robust, full-stack Human-Machine Interface (HMI) designed for real-time industrial and system alarm monitoring. This application provides a high-performance, edge-to-edge "Deep Onyx" dark-themed UI for operators to track, filter, and acknowledge critical system events, powered by a Spring Boot backend and a MySQL relational database.


## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Angular (Standalone Components), TypeScript, HTML5, Custom CSS3 |
| **Backend** | Java, Spring Boot, Spring Data JPA, Hibernate |
| **Database** | MySQL (Relational schema with automated DDL updates) |
| **API Documentation** | OpenAPI / Swagger UI (Auto-launching on startup) |
| **Build Tools** | Maven (Backend), Node Package Manager (Frontend) |

## 📁 Repository Structure

This project uses a monorepo architecture containing both the client and server applications:

```text
SPRING-HMI/
├── alarm-hmi-frontend/      # Angular 17+ Client Application
│   ├── src/app/             # Components, Services, and Route Guards
│   └── package.json         # Frontend dependencies
└── demo/                    # Spring Boot REST API
    ├── src/main/java/       # Controllers, Models, Repositories, Services
    ├── src/main/resources/  # application.properties
    └── pom.xml              # Backend dependencies
