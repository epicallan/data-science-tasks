// import xfs from '../lib/fs-rx.js';
import csv from 'fast-csv';
import fs from 'fs';
import R from 'ramda';
import path from 'path';

const nameIDObjs = [];

const filePathes = (name) => path.resolve(process.cwd(), `./src/house-holds/samples/${name}`);

const sheetStream = fs.createReadStream(filePathes('sheet1.csv'));

const cleanerStream = fs.createReadStream(filePathes('cleaner.csv'));

const csvWriteStream = csv.createWriteStream({ headers: true });

const writableStream = fs.createWriteStream(filePathes('result.csv'));

writableStream.on('finish', () => {
  console.log('DONE! wrtiting new file');
});

export const matchNamesToIds = row =>
  row.info.split(';')
      .map(list => list.split(',')[0])
      .map(name => ({ name: name.trim(), id: row.id }))
      .filter(obj => obj.name.length > 2 && parseInt(obj.id, 10));

export const createRowObj = data => {
  const person = nameIDObjs.find(obj => obj.name.includes(data.Name));
  const id = person ? person.id : null;
  return { ...data, id };
};
let counter = 0;
const cleanerStreamReader = () => {
  csv
    .fromStream(cleanerStream, {
      headers: ['Name', 'Relationship', 'Age',
                'Orphan?', 'Education Level', 'Institution', 'Employed?', 'NSSF']
    })
    .on('data', data => {
      const line = createRowObj(data);
      if (parseInt(line.id, 10)) {
        csvWriteStream.write(line);
        console.log('line', line);
      }
      counter ++;
      // if (counter > 3) process.exit();
    })
    .on('end', () => {
      console.log('done reading cleaner sheet data');
      csvWriteStream.end();
    });
};

csv
  .fromStream(sheetStream, {
    headers: ['id', 'info', 'id']
  })
  .on('data', data => {
    const persons = matchNamesToIds(data);
    nameIDObjs.push(...persons);
  })
  .on('end', () => {
    console.log('done parsing sheet data');
    csvWriteStream.pipe(writableStream);
    cleanerStreamReader();
  });
