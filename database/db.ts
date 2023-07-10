import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "the_arkive",
    host: "localhost",
    user: "admin",
    password: "admin",
    port: 5432,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
