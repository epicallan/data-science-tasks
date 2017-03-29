const R = require('ramda');
const json = require('./narratives');
const fs = require('fs');

// adds question mark
const alterField = obj => Object.assign(obj, { p3_section_title_2: `${obj.p3_section_title_2}?` });

const main = () => {
  const newNarrative =
    R.keys(json)
    .reduce((acc, key) => Object.assign(acc, { [key]: alterField(json[key]) }), {});

  fs.writeFile('narratives-new.json', JSON.stringify(newNarrative), (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
};

main();
