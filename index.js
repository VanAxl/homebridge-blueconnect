/* eslint-disable prefer-arrow-callback */
// index.js
'use strict';
// declare variables for easy access to often-used long-named variables
let Service, Characteristic;
//Constants
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {BlueriiotAPI} = require('./blueriiot-api.js');
//variables
var api = new BlueriiotAPI();



// eslint-disable-next-line no-undef
module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  //Register Homebridge Accessory
  homebridge.registerAccessory('homebridge-blueconnect', 'BlueRiiot', blueconnect);
};


//HomeBridge Accessory Constructor
function blueconnect(log, config, api) {
  this.log = log;
  this.config = config;
  this.homebridge = api;
  this.model = config.model || 'Model not available';
  this.serial = '0000000';
  this.manufacturer = config['manufacturer'] || 'Blue Riiot';

  if (this.config['debug'] === 'true') {
    this.log('CONFIG: Swimming Pool ID '+ this.config.swimmingpoolid);
  }
  if (this.config['debug'] === 'true') {
    this.log('CONFIG: Blue Device Serial '+ this.config.bluedeviceserial);
  }

  this.service = new Service.TemperatureSensor(this.name);
  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({ minValue: -55, maxValue: 125 })
    .on('get', this.getState.bind(this));

  if (this.config['debug'] === 'true') {
    this.log('BlueRiiot accessory is Created!');
  }
}

// Provide the available services this accessory implements
blueconnect.prototype = {

  getState : function(callback) {
    if (this.config['debug'] === 'true') {
      this.log('Get State has been called for : '+ this.model);
    }
    //Init the BlueConnect api
    api.init(this.config.email, this.config.password).then(function(){
      if (this.config['debug'] === 'true') {
        this.log(api.isAuthenticated());
      }
    }).catch( function(error){
      console.log('We have issues signing in: ' + error);
    });
    if (!api.isAuthenticated()){
      //wait for init before quering Temp, waiting send back 0 degree.
      callback(null, 0);
    }else{
      if (!this.config.swimmingpoolid ){     // Then get the Swimming Pool ID
        this.log('No swimmingpool ID provided in the CONFIG, trying to get this value : ');
        api.getSwimmingPools().then(function(data){
          var jsonParsed = JSON.parse(data);
          console.log('Add in Config : "swimmingpoolid": "' +jsonParsed.data[0].swimming_pool_id+'"');
        });
        callback(null, 0);
      }else if (!this.config.bluedeviceserial ){     // Then get the Blue Device Serial
        this.log('No Blue Device Serial provided in the CONFIG, trying to get this value : ');
        api.getSwimmingPoolBlueDevices(this.config.swimmingpoolid).then(function(data){
          var jsonParsed = JSON.parse(data);
          console.log('Add in Config : "bluedeviceserial" : "' +jsonParsed.data[0].blue_device_serial+'"');
        });
        callback(null, 0);
      }else{
        this.temperature = 0;
        api.getLastMeasurements(this.config.swimmingpoolid, this.config.bluedeviceserial)
          .then(function(data){
            var jsonParsed = JSON.parse(data);
            //console.log(jsonParsed.data[0].name +' : '+jsonParsed.data[0].value);
            callback(null, jsonParsed.data[0].value);
            //console.log(jsonParsed.data[1].name +' : '+jsonParsed.data[1].value);
          }) ;
      }
    }
    //callback(null, this.temperature);
  },

  // Provide the available services this accessory implements
  getServices : function() {
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

    this.temperatureService = new Service.TemperatureSensor(this.name);
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getState.bind(this))
      .setProps({
        minValue: this.minTemperature,
        maxValue: this.maxTemperature,
      });
    return [this.informationService, this.temperatureService];
  },

  updateState: function () {
    if (this.config['debug'] == 'true') {
      this.log(' Update State has been called for : '+ this.model);
    }
    return error;
  },
};


/*
blueconnect.prototype = {
     updateState: function (callback) {
        this.log('Update function called' );
        var value = 22.5;
        callback (null, value);
      },

     getState: function () {
        this.log('getState function called' );
        return 29;
     },
     getTemperature: function(callback) {
           value = 21;
           callback(null, value);
     },
     getTemperatureUnits: function (callback) {
        // 1 = F and 0 = C
        var value = 0;
        this.log ("Call to getTemperature Units, response: " + value);
        callback (null, value);
     },
     identify: function(callback) {
       this.log("Identify requested!");
       callback(); // success
     },

     getServices: function () {
        this.informationService = new Service.AccessoryInformation();
        this.informationService
        .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
        .setCharacteristic(Characteristic.Model, this.model)
        .setCharacteristic(Characteristic.SerialNumber, this.serial);

        this.temperatureService = new Service.TemperatureSensor(this.name);
        this.temperatureService.getCharacteristic(this.Characteristic.CurrentTemperature)
            .onGet(this.handleCurrentTemperatureGet.bind(this));

        if (this.update_interval > 0) {
           this.timer = setInterval(this.updateState.bind(this), this.update_interval);
        }

        return [this.informationService, this.temperatureService];
     },

     handleCurrentTemperatureGet() {
          this.log.debug('Triggered GET CurrentTemperature');

          // set this to a valid value for CurrentTemperature
          const currentValue = -270;

          return currentValue;
        }
  };


*/
