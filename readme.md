# My Node.js Application

## Introduction

This is a Node.js application for managing todos. It provides endpoints for creating, updating, deleting, and fetching todos. It also supports uploading images for each todo.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the server directory:

**cd server**

3. Install the required dependencies using npm:

**npm install**

Create .env file to /server and write inside:

MONGO_URI=<your_mongodb_uri> //Get from mongo atlas as free https://www.mongodb.com/cloud/atlas/register
JWT_KEY=<your_jwt_key>
SECRET_KEY=<your_secret_key>

CLOUD_NAME=<cloud_name>
API_KEY=<api_key>
API_SECRET=asdasd

Replace `<your_jwt_key>`, `<your_mongodb_uri>`, `<your_secret_key>`, `<cloud_name>`, `<api_key>`, `<api_secret>` and with your actual keys. /server/.env

## Usage

Once you have installed the dependencies and configured the environment variables, you can start the server by running:

**npm start**

The server will start running on port 3000 by default.

## Endpoints

- `POST /api/users/signup`: Create a new user.
- `POST /api/users/signin`: Login to your account and return jwt token with cookie.
- `POST /api/users/currentuser`: Return current user that you logged in.
- `POST /api/users/signout`: Sign out and clear cookie.

- `POST /api/todos`: Create a new todo.
- `GET /api/todos`: Get all todos.
- `GET /api/todos/:id`: Get a specific todo by ID.
- `PUT /api/todos/:id`: Update a todo by ID.
- `PUT /api/todos/:id/finished`: Update Finish Status a todo by ID.
- `DELETE /api/todos/:id`: Delete a todo by ID.

- `PUT /api/todos/:id/photo`: Update todo photo.
- `DELETE /api/todos/:id/photo`: Delete todo photo.

- `POST /api/todos/:id/files`: Create a new file.
- `DELETE /api/todos/:id/files/:id`: Delete a file by ID.
- `GET /api/todos/:id/files`: Return files by todo ID.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
