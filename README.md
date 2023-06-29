# Etsy Clone

This project is a comprehensive e-commerce application that mimics the functionality of Etsy. The project is built using a microservices architecture and uses a variety of technologies.

## Tech Stack

- **Frontend**: The frontend of the application is built using React. It provides a user-friendly interface for users to browse and purchase items.

- **Backend**: The backend of the application is divided into two parts: a server built with Express.js and a MySQL server. The Express.js server handles various functionalities such as user authentication, item management, and cart management. The MySQL server is used for data persistence.

- **Kafka**: Kafka is used as a message broker to handle real-time data feeds.

- **AWS S3**: AWS S3 is used for storing images related to items and user profiles.

## Getting Started

To get started with the project:

1. Clone the repository.
2. Install the dependencies in the root directory, as well as in the `client`, `server`, `kafka`, and `mysqlserver` directories using `npm install`.
3. Start the application by running `npm start` in the `client`, `server`, `kafka`, and `mysqlserver` directories.

Please note that you will need to have Node.js and npm installed on your machine.

## Features

- User Registration and Authentication
- Item Browsing and Search
- Cart Management
- Order Placement
- User Profile Management
- Favourite Items

Please refer to the individual directories for more specific details about each part of the application.
