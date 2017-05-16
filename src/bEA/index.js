const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-1.3047997,36.7073117&radius=10000&key=AIzaSyAdcvMdbgjfc9hToLkzl56ZJBiQs9nhNEM';

const businessTypes = ['restaurants', 'cafe', 'atm', 'gas_station'];

function createUrl(options) {
  const url = baseUrl + '&type=' + options.type;
  if (options.pageToken) return url + options.pageToken;
  return url;
}

function processData(data) {
  //  location obj, type obj, name , vicinity
  const results = _.map(data, function (obj) {
    const business = {
      location: obj.geometry.location,
      name: obj.name,
      vicinity: obj.vicinity,
      type: obj.types
    };
    return business;
  });

  fs.appendFile('business-nairobi.json', JSON.stringify(results), function (err) {
    if (err) console.log(err);
    console.log('It\'s saved!');
  });
}

function getData(api, type) {
  axios.get(api)
  .then(function (response) {
    processData(response.data.results);
    const pageToken = response.data.next_page_token;
    if (pageToken && response.status === 200) {
      const newApi = createUrl({ type, pageToken });
      getData(newApi, type);
    }
  })
  .catch(function () {
    console.log('no more data');
  });
}

function main() {
  _.map(businessTypes, function (type) {
    const api = createUrl({ type, pageToken: null });
    getData(api, type);
  });
}

main();
