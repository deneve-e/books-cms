# Books CMS

Books CMS is a content management system for managing a collection of books. This project is built using NestJS and provides a robust backend for book-related data.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Features](#features)
- [Usage](#usage)
- [GraphQL Queries](#graphql-queries)
- [Contribution](#contribution)
- [License](#license)

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/books-cms.git
   cd books-cms
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables by creating a `.env` file and adding the necessary configurations.

4. Run the database migrations:
   ```sh
   npm run migration:run
   ```

## Scripts

The project comes with several predefined npm scripts:

- `npm run build`: Build the project using NestJS.
- `npm run format`: Format the codebase using Prettier.
- `npm start`: Start the NestJS application.
- `npm run start:dev`: Start the application in development mode with hot-reload.
- `npm run start:debug`: Start the application in debug mode.
- `npm run start:prod`: Start the application in production mode.
- `npm run lint`: Lint the codebase using ESLint.
- `npm test`: Run the tests using Jest.
- `npm run test:watch`: Run the tests in watch mode.
- `npm run test:cov`: Run the tests and generate a coverage report.
- `npm run test:debug`: Run the tests in debug mode.
- `npm run test:e2e`: Run end-to-end tests.
- `npm run typeorm`: Run TypeORM commands.
- `npm run migration:generate`: Generate a new migration.
- `npm run migration:run`: Run pending migrations.
- `npm run migration:revert`: Revert the last migration.
- `npm run create-initial-admin`: Create an initial admin user.

## Features

- **NestJS**: Utilizes the powerful NestJS framework.
- **GraphQL**: Integrated with Apollo Server for GraphQL support.
- **TypeORM**: ORM for database management.
- **JWT Authentication**: Secure authentication with JWT.
- **E2E Testing**: Comprehensive end-to-end testing setup with Jest and Supertest.

## Usage

1. Start the application:

   ```sh
   npm start
   ```

2. The application will be available at `http://localhost:3000`.

3. Access the GraphQL playground at `http://localhost:3000/graphql`.

## GraphQL Queries

For detailed information about the available GraphQL queries and mutations, refer to the [GraphQL Queries Documentation](docs/graphql-queries.md).

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is UNLICENSED.
