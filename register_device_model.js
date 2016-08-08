'use strict'
const glob = require("glob");
const fs = require('fs');
const https = require('https');

var iotcsInstanceFile = 'iotcs-instance.json';
const port = 443;
const API = '/iot/api/v2/deviceModels/';

// Get IoTCS data from its separate config file
var iotcsData = JSON.parse(fs.readFileSync(iotcsInstanceFile));
var iotcs = iotcsData.instance;
var credential = iotcsData.username + ':' + iotcsData.password;

var deviceFilesPattern = process.argv.slice(2)[0];

if ( !deviceFilesPattern) {
  console.log("JSON device file(s) required. Wildcards allowed but make sure you quote it. E.g.: 'urn*.json' ");
  process.exit(-1);
}

var files = glob.sync(deviceFilesPattern);
files.forEach(function(filename) {
  var payload = fs.readFileSync(filename);
  var json = JSON.parse(payload);

  // First, let's see if this device model URN already exists in the IoTCS instance
  var request = https.request({
    host : iotcs,
    port : port,
    path : API + json.urn,
    auth: credential,
    method : 'GET',
    headers : {
      'Accept': 'application/json'
    }
  }, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        data += chunk.toString();
      });
      response.on('end', () => {
        if ( response.statusCode === 200) {
          console.log("Model '" + json.urn + "' already exists in the IoTCS instance. Skipping");
        } else if (response.statusCode === 404) {
          console.log("Creating model with URN '" + json.urn + "'");
          var model = {};
          model.urn = json.urn;
          model.name = json.name;
          model.description = json.description;
          if (json.attributes.length > 0)
            model.attributes = json.attributes;
          if (json.actions.length > 0)
            model.actions = json.actions;
          if (json.formats.length > 0)
            model.formats = json.formats;

          var request = https.request({
            host : iotcs,
            port : port,
            path : API,
            auth: credential,
            method : 'POST',
            headers : {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }, (response) => {
              var data = '';
              response.on('data', (chunk) => {
                data += chunk.toString();
              });
              response.on('end', () => {
                if ( response.statusCode === 201) {
                  console.log("Model '" + model.urn + "' created successfully");
                } else {
                  console.log("Error creating model [" + response.statusCode + "]: " + data);
                }
              });
          });
          request.write(JSON.stringify(model));
          request.end();
        } else {
          console.log("Error retrieving model [" + response.statusCode + "]: " + data);
        }
      });
  }).end();
});
