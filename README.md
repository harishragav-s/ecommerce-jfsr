# StyleKart - E-Commerce Application

## Overview

StyleKart is a Java Full Stack e-commerce application built using React.js for the frontend and Java Spring Boot for the backend. It provides a complete e-commerce experience with user authentication, product management, shopping cart, orders, reviews, address management, and online payments.

## Technologies Used

### Frontend

React.js, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS

### Backend

Java 21, Spring Boot, Spring Security, Spring Data MongoDB, JWT Authentication, REST APIs

### Microservices

Spring Cloud Gateway, Eureka Server, OpenFeign, Resilience4j

### Database & Tools

MongoDB, Maven, Swagger/OpenAPI, Git, GitHub, PayPal

## Features

- User registration and login
- JWT-based authentication and role-based authorization
- Product browsing and management
- Product reviews and ratings
- Shopping cart management
- Order placement and management
- Address management
- PayPal payment integration
- Admin management
- Microservices-based backend architecture
- Service discovery using Eureka
- API Gateway for request routing
- Inter-service communication using OpenFeign
- Fault tolerance using Resilience4j

## Project Structure

```text
StyleKart/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── api-gateway/
│   ├── eureka-server/
│   ├── auth-service/
│   ├── product-service/
│   ├── cart-service/
│   └── order-service/
│
└── README.md
```

## How to Run

### Prerequisites

Make sure the following are installed:

- Java 21
- Node.js
- Maven
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/harishragav-s/ecommerce-jfsr.git
cd ecommerce-jfsr
```

### Run the Backend

Start the services in the following order:

1. Eureka Server
2. Auth Service
3. Product Service
4. Cart Service
5. Order Service
6. API Gateway

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will start using the Vite development server.

## API Documentation

Swagger/OpenAPI is integrated into the backend services for exploring and testing the available REST APIs.

```text
http://localhost:<port>/swagger-ui/index.html
```
