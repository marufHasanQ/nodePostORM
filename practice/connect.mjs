//TODO basic connection pg
import pkg from 'pg';
import {dbSelectRows} from '../queryFunction.mjs';
const {Client} = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test_db',
    password: 'password',
    port: 5432,
});

client.connect().then(() => {
    // client.query('SELECT * FROM "table_namek" WHERE "id" = 5;', (err, res) => {
    client.query(dbSelectRows(`table_name`)([`*`])(`"id" = 6`), (err, res) => {
        if (err) {
            console.log(err);
            console.log('error printed');
            client.end();
            return;
        }
        console.log('rows', res, res.rows);
        client.end();
    });
});

console.log(dbSelectRows(`table_name`)([`*`])(`"id" = 5`));
