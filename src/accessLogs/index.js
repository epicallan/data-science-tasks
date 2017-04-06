// const Maybe = require('folktale/data/maybe');
const R = require('ramda');
const readline = require('readline');
const fs = require('fs');
const fsp = require('fs-promise');
const iplocation = require('iplocation')
const csv = require('fast-csv');

const ipCache = {};

const botAgents = async () =>
  fsp.readFile('./badAgents.txt', 'utf8').catch(console.error);

const botReferer = async () =>
  fsp.readFile('./badreferers.txt', 'utf8').catch(console.error);

const csvWriteStream = csv.createWriteStream({ headers: true });

const writableStream = fs.createWriteStream('./logs/result.csv');

// "Host","Log Name","Date Time","Time Zone","Method","URL","Response Code","Bytes Sent",
// "Referer","User Agent"
const tokenise = (string) => {
  const arr = string.split(',').map(sanitize);
  return { ip: arr[0], date: arr[2], method: arr[4], url: arr[5],
    status: arr[6], referer: arr[8], agent: arr[9] };
};

const sanitize = str => str.trim().replace(/"/g, '')

const filterByMethod = obj => obj.method.includes('GET');

const filterByStatus = obj => Number(obj.status) === 200;

const filterBots = R.curry((type, bots, obj) => {
  if (type === 'referer' && obj[type].length < 2) return false;
  return !bots.some(bad => bad === obj[type]);
});

const filterByPdfs = obj => R.match(/\.pdf$/g, obj.url).length > 0;

const lineFilter = (fns, line) =>
  fns.map(fn => fn(line)).some(bool => bool == false);

const filterByIp = obj => R.match(/^[0-9]/g, obj.ip).length > 0;

const isValidPdfDownload = R.curry((botsR, botsA, line) => {
  const obj = tokenise(line);
  const filterByReferer = filterBots('referer', botsR);
  const filterByAgent = filterBots('agent', botsA);
  const filterFns = [filterByIp, filterByMethod, filterByStatus, filterByReferer, filterByAgent, filterByPdfs]
  const isValid = !lineFilter(filterFns, obj);
  // const isValid =  filterByPdfs(obj);
  // console.log(isValid);
  return isValid ? obj : false;
});

const getGeoLocation = async (ip) => {
  if (ipCache[ip]) return Promise.resolve({ country_name : ipCache[ip] });
  return iplocation(ip).catch((err) => console.error(`ip adderes error ${ip} ..`));
}

async function main() {
  const botsA = await botAgents();
  const botsR = await botReferer();
  const rd = readline.createInterface({
    input: fs.createReadStream('./logs/mar-new.csv'),
    console: false
  });
  const isValid = isValidPdfDownload(botsR.split(/\n/), botsA.split(/\n/));

  csvWriteStream.pipe(writableStream);

  rd.on('line', async (line) => {
    const validLine = isValid(line);
    if (!validLine) return false;
    const ipAddress = validLine.ip;
    // console.log('ipAddress', ipAddress);
    const location =  await getGeoLocation(ipAddress);
    if (!location) ipCache[ipAddress] = "unknown";
    if (!ipCache[ipAddress]) ipCache[ipAddress] = location.country_name;
    return csvWriteStream.write({date: validLine.date, pdf: validLine.url, country: ipCache[ipAddress]});
  });

}

main();
