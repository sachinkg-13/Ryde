# TAXI APPLICATION Backend API Documentation

## Technologies
- Node.js, Express.js, MongoDB, JWT

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sachinkg-13/Taxi-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd uber-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the server:
   ```bash
   npm start
   ```
2. The server will be running on [http://localhost:3000](http://localhost:3000).

## Endpoints

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
  Returns coordinates for a given address.  
  *Query:* `?address=<address>`
- **GET /maps/get-distance-time**  
  Returns distance and time between two locations.  
  *Query:* `?origin=<>&destination=<>`
- **GET /maps/get-suggestions**  
  Provides autocomplete suggestions.  
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

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.