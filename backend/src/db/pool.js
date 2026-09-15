const {Pool} = require("pg");

const pool = new Pool({
    host:"localhost",
    port:5432,
    database:"nada_webapp",
    user:"postgres",
    password:"12345678"
});

module.exports = pool;