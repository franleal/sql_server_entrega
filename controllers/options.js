const options = {
    mysql: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "ecommerce",
        },
        pool: { min: 0, max: 7 },
    },
    sqlite3: {
        client: "sqlite3",
        connection: {
            filename: "/PROGRAMACION/BACK END/prueba 1/db/mydb.sqlite",
        },
        useNullAsDefault: true,
    },
};

module.exports = options;