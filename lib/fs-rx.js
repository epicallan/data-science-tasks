import fs from 'fs';
import readline from 'readline';
import Rx from 'rxjs/Rx';
import path from 'path';

export const fromNodeStreamToObserveable = (stream, dataEventName, finishEventName) =>
  (Rx.Observable.create(observer => {
    stream.addListener(dataEventName, data => observer.next(data));
    stream.addListener('error', error => observer.error(error));
    stream.addListener(finishEventName, () => observer.complete());
    stream.resume();
    return () => {
      stream.removeAllListeners(dataEventName);
    };
  }));

// returns a write stream for writing to the resultant csv file
export const writerStream = (currentDir = __dirname, name = 'result.csv') => {
  const resultCsvFile = path.resolve(currentDir, name);
  return fs.createWriteStream(resultCsvFile);
};

// Rx Observable that reads csv file by line and emits the lines as a stream
export const readLineStream = (filePath) => {
  const rl = readline.createInterface({ input: fs.createReadStream(filePath) });
  return fromNodeStreamToObserveable(rl, 'line', 'close');
};

// returns a stream of csv files from a specified directory or current directory
export const readDirFiles = (directory, annex, prefix) => {
  let re = new RegExp('.csv$');
  if (annex) re = new RegExp(`(${annex})(?=\.csv$)`);
  if (prefix) re = new RegExp(`(^${prefix})(?=.*\.csv$)`);
  const stream = Rx.Observable.bindNodeCallback(fs.readdir);
  return stream(directory)
    .flatMap(files => Rx.Observable.from(files))
    .filter(file => re.test(file))
    .map(file => path.resolve(directory, file));
};
