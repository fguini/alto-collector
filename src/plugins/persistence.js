import Knex from 'knex';

const db = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  debug: false, // isDevelopment,
  asyncStackTraces: false, // isDevelopment,
  connection: {
    filename: './data.sqlite',
  },
  migrations: {
    directory: 'src/migrations',
    tableName: 'migrations',
  },
  seeds: {
    directory: 'src/migrations/seeds',
  },
});

export const getDb = () => db;
