const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=0.3138386,32.529085&radius=5000&key=AIzaSyAdcvMdbgjfc9hToLkzl56ZJBiQs9nhNEM';

// const businessTypes = ['restaurants', 'cafe', 'atm', 'gas_station'];

const businessTypes = ['restaurants', 'cafe'];

function createUrl(options) {
  const url = baseUrl + '&type=' + options.type;
  if (options.pageToken) return url + options.pageToken;
  return url;
}

function processData(data) {
  //  location obj, type obj, name , vicinity
  /**
    { location : {
       "lat": -33.871042,
         "lng": 151.1978691
      },
      name: "business name",
      vicinity: "vicinity name"
      type: [types]
    }
   */

  const results = _.map(data, function () {

  });
  fs.appendFile('business.json', JSON.stringify(results), function (err) {
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
