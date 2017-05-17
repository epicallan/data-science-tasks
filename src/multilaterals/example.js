const _ = require('lodash');
const fs = require('fs');
const json = require('./narratives');

// the new field to add
const newField = { key: ' some value' };

// create a function that takes in an object and adds a new field
function addNewField(obj) {
  return _.assign(obj, newField);
}

// a function that loops through the object and provides the object to add anew field to
function loopThroughObject() {
  const jsonKeys = _.keys(json); // ['generic', 'African...']
  const newJson = jsonKeys.map(function (key) {
    const currentObj = json[key];
    const newObj = addNewField(currentObj);
    return newObj;
  });
  return newJson;
}


function main() {
  const data = loopThroughObject();
  fs.writeFile('example.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

main();
