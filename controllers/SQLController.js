const knex = require("knex");

class Contenedor {
    constructor(options, table) {
        this.connection = knex(options);
        this.table = table;
    }

    async save(objeto) {
        try {
            const exists = await this.connection.schema.hasTable(this.table);
            if (!exists) {
                await this.connection.schema.createTable(this.table, table => {
                    table.string("id").notNullable();
                    table.string("title").notNullable();
                    table.float("price");
                    table.string("thumbnail").notNullable();
                });
            } else {
                await this.connection(this.table).insert(objeto);
            }
        } catch (error) {
            console.log(`Error agregando objeto a la tabla: ${error.message}`);
        }
    }

    async saveMessages(mensaje) {
        try {
            const exists = await this.connection.schema.hasTable('mensajes');
            console.log(exists)
            if (!exists) {
                await this.connection.schema.createTable('mensajes', table => {
                    table.string("email").notNullable();
                    table.string("text").notNullable();
                    table.string("time").notNullable();
                    console.log('TABLA CREADA')
                });
            } else {
                await this.connection('mensajes').insert(mensaje);
                console.log('MENSAJE AGREGADO A LA TABLAS')
            }
        } catch (error) {
            console.log(`Error agregando objeto a la tabla: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await this.connection(this.table).where("id", id);
        } catch (error) {
            console.log(`Error buscando objeto con el id: ${error.message}`);
        }
    }

    async getAll() {
        /* chequeo si existe el documento */
        try {
            return await this.connection(this.table);
        } catch (error) {
            console.log(`Error obteniendo tabla: ${error.message}`);
        }
    }

    async deleteById(id) {
        /* chequeo si existe el documento */
        try {
            await this.connection(this.table).where("id", id).del();
            return id;
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando el objeto con el id solicitado: ${error.message}`
            );
        }
    }

    async deleteAll() {
        try {
            await this.connection(this.table).del();
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando los datos: ${error.message}`
            );
        }
    }
}

module.exports = Contenedor;