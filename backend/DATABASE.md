# Local PostgreSQL and Prisma

PostgreSQL runs as the Windows service `postgresql-x64-18`. Closing pgAdmin does not stop the service.

1. Set `PGPASSWORD` in `backend/.env` to your PostgreSQL password. The file is ignored by Git. The default connection uses `localhost:5432`, user `postgres`, and database `dna_genetics`.
2. From the `backend` folder, run `npm run db:setup`. This creates the database if absent, generates Prisma Client, applies migrations, and verifies the connection. Existing data is preserved.
3. In the same terminal, run `npm run dev` to keep the Express API running on port 3001.
4. In a separate terminal, enter the `frontend` folder and run `npm run dev` for port 5173.

To inspect the database visually, run `npm run db:studio` in another backend terminal, or open pgAdmin and refresh the Databases list. Neither is required to keep the API running.

Development defaults to the local catalogue unless configured otherwise. To connect the pages, put `VITE_USE_BACKEND=true` in `frontend/.env.local` and restart Vite.

## Current migration stage

Products and categories now use the relational `Product` and `Category` tables. Product images remain an ordered string array on Product. Prices use PostgreSQL decimal columns. The existing API format is preserved by `catalogue-store.js`; other features still use `dna_genetics_state` JSONB. On the first API transaction after migration, existing catalogue entries transfer atomically into the relational tables. Pack sizes and individual regular/sale prices use `ProductVariant`. Source availability is stored separately from local stock. The remaining feature models are future migrations.

The frontend connection is enabled in `frontend/.env.local`. Keep the backend running while using the dashboard or catalogue. The 42 source-checked Feminized Seeds products replace matching sample records. Descriptions are adapted. Local stock starts at zero; reference availability is not a local inventory count. Source records are in `reference/feminized-product-records.json`.

After changing the schema, use `npm run db:migrate -- --name descriptive_name` and `npm run db:generate`. Do not reset a database containing data you want to retain.

Prisma configuration follows the [Prisma PostgreSQL documentation](https://www.prisma.io/docs/orm/overview/databases/postgresql).
