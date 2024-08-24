# Books CMS

A NestJS-based content management system for managing book collections.

## Quick Start

1. Clone and enter the repository:

   ```sh
   git clone https://github.com/deneve-e/books-cms.git
   cd books-cms
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up `.env` file with necessary configurations.

4. Run database migrations:

   ```sh
   npm run migration:run
   ```

5. Start the application:

   ```sh
   npm start
   ```

6. Access the app at `http://localhost:3000` and GraphQL playground at `http://localhost:3000/graphql`.

## Key Features

- NestJS framework
- GraphQL with Apollo Server
- TypeORM for database management
- JWT Authentication
- E2E Testing

## Available Scripts

- Development: `npm run start:dev`
- Production: `npm run start:prod`
- Testing: `npm test`
- Linting: `npm run lint`
- Migrations: `npm run migration:generate`, `npm run migration:run`, `npm run migration:revert`

## License

UNLICENSED
