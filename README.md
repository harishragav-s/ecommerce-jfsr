# StyleKart - E-Commerce Website

## Overview

StyleKart is a full-stack e-commerce web application developed using Java Spring Boot and React.js. The application provides a complete online shopping experience with user authentication, product browsing, shopping cart, order management, product reviews, address management, and online payments. The backend is designed using a microservices architecture to provide better separation of responsibilities and scalability.

## Features

StyleKart supports secure user registration and login with JWT-based authentication and role-based authorization. Users can browse products, manage their shopping cart, place orders, manage delivery addresses, review products, and make payments through PayPal. Administrators can manage products and orders through dedicated management functionality. The application also uses service discovery, API gateway routing, inter-service communication, and fault-tolerance mechanisms across its backend services.

## Technologies

The frontend is developed using React.js with Vite, Redux Toolkit, React Router, Axios, and Tailwind CSS. The backend is built using Java 21, Spring Boot, Spring Security, Spring Data MongoDB, JWT, and REST APIs. The microservices architecture uses Spring Cloud Gateway, Eureka Service Discovery, OpenFeign, and Resilience4j. MongoDB is used as the primary database, while Swagger/OpenAPI is used for API documentation and testing.

## Project Structure

```text
StyleKart/
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
