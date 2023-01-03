import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

const config: SqliteConnectionOptions = {
        "type": "sqlite",
        "database": "db.sqlite3",
        "synchronize": true,
        "logging": false,
        "entities": ["dist/src/**/*.entity{.js, .ts}"],
}

export default config;