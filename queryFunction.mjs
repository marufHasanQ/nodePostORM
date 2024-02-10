import {createConnectionPool} from './db.mjs'
const POOL = createConnectionPool();
POOL.on('error', (err, client) => console.log(err));


function dbInsertValues(tableName) {
    return insertValuesMap => {
        // TODO reimplement separateKeyValueFromMap
        const [collumns, values] = separateKeyValueFromMap(insertValuesMap);
        const query = `INSERT INTO "${tableName}" (${collumns}) VALUES  (${values});`;

        return dbMakeQuery(query)
            .then(v => v.rowCount);

    }
}

function dbDeleteRows(tableName) {
    return conditions => {
        const query = `DELETE FROM "${tableName}" WHERE ${conditions}`;
        return query;
    }
}

function dbSelectRows(tableName) {
    return collumns => conditions => {
        let query = `SELECT ${collumns.join(',')} FROM "${tableName}" WHERE ${conditions};`;


        return dbMakeQuery(query)
            .then(v => v.rows);
    }
}

function dbCheckExistence(tableName) {
    return conditions => {
        const query = `SELECT EXISTS(SELECT 1 FROM "${tableName}" WHERE ${conditions});`;
        return dbMakeQuery(query)
            .then(v => v.rows[0].exists);
    }
}

function separateKeyValueFromMap(collumnsValueMap) {
    const keys = [...collumnsValueMap.keys()];
    // gathers all the values and put them in the same order the keys are
    const values = keys.reduce((acc, v) => [...acc, collumnsValueMap.get(v)], [])
        // made sure all the values type string has extra `''` around the actual values
        // otherwise in results '(7,user3)' not '( 7, 'user3')' in the dbInsertValues
        .map(v => typeof (v) === 'string' ? "'" + v + "'" : v);
    return [keys.map(v => '"' + v + '"').join(','), values.join(',')];
}

function dbMakeQuery(query) {

    return dbQuery(POOL)(query)
        .then(v => v)

    function dbQuery(pool) {
        return query => {

            return pool.query(query);
        }
    }

};

function logger(v) {
    console.log(v);
    return v;
}

/*


const collumnsValueMap = new Map([['email', 'example3@gmail.com'], ['password', '43324a234eeef']]);

dbCheckExistence("table_name")(`"id" = 8`)
    .then(v => console.log(v));
dbInsertValues('User')(collumnsValueMap)
dbSelectRows("User")(['password'])(`email =  'example3@gmail.com'`)
dbSelectRows("User")(['*'])(`true`)
    .catch(v => {console.error('error summary:', v.detail, '\n', 'error explaination :', v);})

dbMakeQuery([dbCheckExistence("table_name")(`"id" = 8`), `SELECT "password" FROM "User" WHERE "email" = 'example1@gmail.com';`])
    .then(v => console.log(v[1][0]['password']))
  dbInsertValues('User')(collumnsValueMap),
console.log(collumnsValueMap);
console.log('separateKeyValueFromMap', separateKeyValueFromMap(collumnsValueMap));
console.log('dbInsertValues', dbInsertValues('table_name')(collumnsValueMap));
console.log('dbCheckExistence', dbCheckExistence("table_name")(`"id" = 8`));

*/
export {dbMakeQuery, dbInsertValues, dbDeleteRows, dbCheckExistence, dbSelectRows, separateKeyValueFromMap};




