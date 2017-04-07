/*
The default IP api wasnt providing country codes and names
so I include the new IP and rerun the results over this script
 */
const readline = require('readline');
const fs = require('fs');
const iplocation = require('iplocation');
const csv = require('fast-csv');

const ipCache = {};

const csvWriteStream = csv.createWriteStream({ headers: true });

const writableStream = fs.createWriteStream('./result-clean.csv');

const sanitize = str => str.trim();

const tokenise = (string) => {
  const arr = string.split(',').map(sanitize);
  return { date: arr[0], pdf: arr[1], country_name: arr[2], country: arr[3],
    ip: arr[4]
  };
};

const lineFilter = line => line.country.length === 0;

const getGeoLocation = async (ip) => {
  if (ipCache[ip]) {
    return Promise
    .resolve({ country: ipCache[ip].country, country_name: ipCache[ip].country_name });
  }
  return iplocation(ip).catch(() => console.error(`ip adderes error ${ip}`));
};

const readlineStream = file => readline.createInterface({
  input: fs.createReadStream(file),
  console: false
});

const writeLine = data => csvWriteStream
  .write({ date: data.date, pdf: data.pdf,
    country_name: data.country_name, country: data.country,
    ip: data.ip
  });

async function main() {
  const rd = readlineStream('./result.csv');
  csvWriteStream.pipe(writableStream);
  rd.on('line', async (line) => {
    const lineObj = tokenise(line);
    const isValid = lineFilter(lineObj);
    if (!isValid) return writeLine(lineObj);
    const ipAddress = lineObj.ip;
    const location = await getGeoLocation(ipAddress);
    if (location === undefined && !ipCache[ipAddress]) {
      ipCache[ipAddress] = { country: 'unknown', country_name: 'unknown' };
    }
    if (!ipCache[ipAddress]) {
      ipCache[ipAddress] = {
        country: location.countryCode || location.country_code || location.country,
        country_name: location.country_name || location.country };
    }
    // console.log('missing country', ipAddress, location);
    const newLine = Object.assign(lineObj, ipCache[ipAddress]);
    return writeLine(newLine);
  });
}

main();
