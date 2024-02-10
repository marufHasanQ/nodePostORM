import {createConnectionPool} from './db.mjs'
const pool = createConnectionPool();

function dbQuery(pool) {
    return queries => {
        return Promise.allSettled(queries.map(v => pool.query(v)))
    }
}

function dbInsertValues(tableName) {
    return insertValuesMap => {
        // TODO reimplement separateKeyValueFromMap
        const [collumns, values] = separateKeyValueFromMap(insertValuesMap);
        const query = `INSERT INTO "${tableName}" (${collumns}) VALUES  (${values})`;
        return query;
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
        const query = `SELECT ${collumns.join(',')} FROM "${tableName}" WHERE ${conditions};`;
        return query;
    }
}

function dbCheckExistence(tableName) {
    return conditions => {
        const query = `SELECT EXISTS(SELECT 1 FROM "${tableName}" WHERE ${conditions})`;
        return query;
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

const collumnsValueMap = new Map([['id', 8], ['name', 'user8']]);
console.log(collumnsValueMap);
console.log('separateKeyValueFromMap', separateKeyValueFromMap(collumnsValueMap));
console.log('dbInsertValues', dbInsertValues('table_name')(collumnsValueMap));

function dbMakeQueries(queries) {
    return dbQuery(pool)(queries)
        .then(v => v.map(v => v.value.rows))
        .catch(v => console.error('error', v))
};

//dbMakeQueries([dbSelectRows(`table_name`)([`*`])(`"id" = 7`), `SELECT * FROM "table_name";`])
//    .then(v => console.log(v));

export {dbMakeQueries, dbInsertValues, dbDeleteRows, dbCheckExistence, dbSelectRows, separateKeyValueFromMap};



