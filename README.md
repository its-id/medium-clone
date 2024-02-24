# Medium Clone

- backend (honojs, cloudflare workers)
- frontend (nextjs)

## Running the BACKEND

To run the backend made on honojs for cloudflare workers, you need to follow these steps:

- Obtain a postgres server from a provider such as [aiven](https://aiven.io/).
- Visit [Prisma accelerate](https://www.prisma.io/data-platform/accelerate) and generate an accelerate connection string for your database URL.
- Since Prisma does not support CLI, you need to put the actual database URL in the .env file.
- The backend will connect to the connection pool through the wrangler.toml file. Therefore, you need to put the connection pool API key after the [vars] keyword in the file.
  ```toml
  # [vars]
  DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=[YOUR_API_KEY]"
  JWT_SECRET='jwtsecret123'
  ```
- `npm install`.
- `npm run dev`.
