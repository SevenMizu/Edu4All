# Edu4All Frontend

Edu4All is a modern educational platform frontend project built with React.

## Tech Stack

- React 18.2.0
- React Router 6.30.0
- Redux 5.0.1
- Bootstrap 5.3.6
- CKEditor 6.2.0
- Axios 1.9.0

## Project Structure

```
src/
├── api/          # API interface definitions
├── assets/       # Static assets
├── components/   # Reusable components
├── contexts/     # React Context definitions
├── pages/        # Page components
├── resources/    # Resource files
├── services/     # Service layer
└── styles/       # Style files
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

# Install dependencies

npm install

````

### Development

```bash
# Start development server
npm start
````

The application will run at http://localhost:3000.

### Build

```bash
# Build for production
npm run build
```

The build files will be located in the `build` directory.

## Key Features

- User Authentication & Authorization
- Rich Text Editing (using CKEditor)
- File Upload
- Responsive Design

## Development Guidelines

- Use ESLint for code style checking
- Follow React best practices
- Use functional components and Hooks
- Style management with CSS Modules or styled-components

# Edu4All Backend

A comprehensive Spring Boot backend service for the Edu4All education platform, featuring user management, resource handling, and Zoom integration.

## Tech Stack

- Java 17
- Spring Boot 3.1.4
- Spring Security with JWT
- Spring Data JPA
- MySQL 8.0
- WebSocket for real-time communication
- Zoom API Integration
- Gradle Build Tool

## Core Features

- User Authentication & Authorization
- Educational Resource Management
- Zoom Meeting Integration
- File Upload & Management
- RESTful API Architecture
- Database Integration with MySQL

## Project Structure

```
edu4all-phase3-backend/
├── src/
│   ├── main/
│   │   ├── java/edu4all/
│   │   │   ├── config/         # Configuration classes
│   │   │   ├── controller/     # REST controllers
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── model/         # Entity classes
│   │   │   ├── repository/    # Data access layer
│   │   │   ├── security/      # Security configurations
│   │   │   ├── service/       # Business logic
│   │   │   ├── utils/         # Utility classes
│   │   │   ├── view/          # View models
│   │   │   └── websocket/     # WebSocket handlers
│   │   └── resources/
│   │       ├── static/        # Static resources
│   │       └── application.properties  # Application configuration
│
├── build.gradle               # Gradle build configuration
└── settings.gradle           # Gradle project settings
```

## Prerequisites

- JDK 17 or higher
- Gradle 7.0 or higher
- MySQL 8.0 or higher

## Configuration

The application requires the following configurations in `application.properties`:

- Database connection settings
- JWT secret key
- Zoom API credentials
- File upload settings
- Server configuration

## Quick Start

Run the application

```bash
./gradlew bootRun
```

The server will start on port 8080 by default.

## API Documentation

The backend provides RESTful APIs for:

- User management
- Educational resources
- Zoom meeting integration
- File management

## Security Features

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control
- Secure file upload handling
- CORS configuration

## File Upload

- Maximum file size: 50MB
- Upload directory: `uploads/`
- Supported file types: PDF, JPG, JPEG, PNG

## Zoom Integration

The application integrates with Zoom API for:

- Meeting creation and management
- Meeting scheduling
- Real-time meeting status updates

## Development Guidelines

1. Code Standards

- Follow Java coding conventions
- Use Spring Boot best practices
- Implement proper error handling
