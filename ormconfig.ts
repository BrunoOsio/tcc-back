import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

const config: SqliteConnectionOptions = {
        "type": "sqlite",
        "database": "db.sqlite3",
        "synchronize": true,
        logging: true,
        "entities": ["dist/src/**/*.entity{.js, .ts}"],
}

export default config;