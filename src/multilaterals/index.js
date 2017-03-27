const R = require('ramda');
const json = require('./narratives');
const fs = require('fs');

const addNewField = obj => Object.assign(obj, { m8a_axis_title: '2015, US$ millions/billions' });

const sortFieldsAlphabetically = obj =>
  R.keys(obj).sort().reduce((acc, val) => Object.assign(acc, { [val]: obj[val] }), {});


const newJsonObject = R.compose(sortFieldsAlphabetically, addNewField);

const main = () => {
  const newNarrative =
    R.keys(json)
    .reduce((acc, key) => Object.assign(acc, { [key]: newJsonObject(json[key]) }), {});

  fs.writeFile('narratives-new.json', JSON.stringify(newNarrative), (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
};

main();
