# RYDE (Taxi Application)

## Description
Ryde is a comprehensive full-stack taxi application designed to streamline ride-hailing services. It features a powerful backend built with Node.js, Express, MongoDB, and JWT as well as a dynamic React-based frontend developed with Vite. Real-time functionalities like live location updates are handled using Socket.io, while mapping and navigation are powered by the Google Maps API.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Overview
A full-stack taxi application that provides a robust backend API and a responsive frontend interface. The backend is built with Node.js, Express, MongoDB, and JWT for authentication, while the frontend is implemented using React and Vite. Real-time functionalities, such as live location updates, are powered by Socket.io.

## Project Structure
- **Backend**: Located in the `Backend` directory. Contains:
  - Express server and API routes for users, captains, maps, and rides.
  - A socket implementation for real-time communication.
  - Environment configuration and database connection.
- **Frontend**: Located in the `Frontend` directory. Contains:
  - A React application built with Vite.
  - Routing, context providers (User, Captain, Socket), and pages for login, registration, and ride management.

## Technologies
- **Backend**: Node.js, Express.js, MongoDB, JWT, Socket.io, Google Maps API
- **Frontend**: React, Vite, React Router

## Prerequisites
- Node.js (version 14+)
- npm

## Installation

### Clone the Repository
```bash
git clone https://github.com/sachinkg-13/Ryde.git
cd Ryde
```

### Setup Backend
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` folder to configure environment variables (e.g., PORT, DB connection string).

### Setup Frontend
```bash
cd ../Frontend
npm install
```

## Running the Application

### Start the Backend Server
From the `Backend` directory, run:
```bash
npm start
```
The backend server will be running on [http://localhost:3000](http://localhost:3000).

### Start the Frontend Client
From the `Frontend` directory, run:
```bash
npm run dev
```
Access the frontend in your browser at the provided local URL (typically [http://localhost:5173](http://localhost:5173)).

## API Endpoints

### Users
- **POST /users/register**  
  Registers a new user.  
  *Body:* `{ fullname: { firstname, lastname }, email, password }`
- **POST /users/login**  
  Logs in a user.  
  *Body:* `{ email, password }`
- **GET /users/profile**  
  Retrieves the authenticated user’s profile.  
  *Auth:* `Bearer <token>`
- **GET /users/logout**  
  Logs out the current user.

### Captains
- **POST /captains/register**  
  Registers a new captain.  
  *Body:* `{ fullname: { firstname, lastname }, email, password, vehicle: { color, plate, capacity, vehicleType } }`
- **POST /captains/login**  
  Logs in a captain.  
  *Body:* `{ email, password }`
- **GET /captains/profile**  
  Retrieves the authenticated captain’s profile.  
  *Auth:* `Bearer <token>`
- **GET /captains/logout**  
  Logs out the current captain.

### Maps
- **GET /maps/get-coordinates**  
  Returns coordinates for a given address using the Google Maps API.  
  *Query:* `?address=<address>`
- **GET /maps/get-distance-time**  
  Returns distance and time between two locations using the Google Maps API.  
  *Query:* `?origin=<>&destination=<>`
- **GET /maps/get-suggestions**  
  Provides autocomplete suggestions using the Google Places API.  
  *Query:* `?input=<input>`

### Rides
- **POST /rides/create**  
  Creates a new ride.  
  *Body:* `{ pickup, destination, vehicleType }`  
  *Auth:* `Bearer <token>`
- **GET /rides/get-fare**  
  Returns fare estimates between two locations.  
  *Query:* `?pickup=<>&destination=<>`  
  *Auth:* `Bearer <token>`

## Screenshots

### Home Page (User)
![Home Page](./screenshots/home_page.png)
<!--// A screenshot of the user home page displaying ride options and current ride status.-->

### Captain Home Page
![Captain Home Page](./screenshots/captain_home.png)
<!--// A screenshot of the captain home page displaying ride requests and real-time navigation.

// You can add more screenshots as required-->

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

<hr>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&center=true&width=435&lines=Happy+Coding!+😊" alt="Happy Coding">
</p>
