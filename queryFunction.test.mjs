import {separateKeyValueFromMap,dbInsertValues,dbDeleteRows,dbSelectRows,dbCheckExistence} from './queryFunction.mjs';
   const  collumnsValueMap = new Map([['one','oneValue'],['two','twoValue'],['three','threeValue'],['four','fourValue']]);

  const transformedMap = separateKeyValueFromMap(collumnsValueMap); 

test('checks converted collumns name and values from map ', function() {
    console.log(transformedMap);
expect(transformedMap.at(0) === 'one,two,three,four' && transformedMap.at(1) === "'oneValue','twoValue','threeValue','fourValue'").toBeTruthy();

});
it('check sql query for check existence of values', function() {
   expect(dbCheckExistence('tableName')("pass = 'one'")).toBe("select exists(select 1 from tableName where pass = 'one')"); 
});
it('check sql query for selecting values where condition is true', function() {
   expect(dbSelectRows('tableName')(['one','two','three'])("pass = 'one'")).toBe(`select one,two,three from tableName where pass = 'one';`); 
});

it('check sql query delete from query', function() {
   expect(dbDeleteRows('tableName')("pass = 'one'")).toBe(`delete from tableName where pass = 'one'`); 
});

it('check sql query for inserting values in table ', function() {
   expect(dbInsertValues('tableName')(collumnsValueMap)).toBe(`insert into tableName (one,two,three,four) values  ('oneValue','twoValue','threeValue','fourValue')`); 
});

