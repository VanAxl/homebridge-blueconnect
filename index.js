// index.js
"use strict";
// declare variables for easy access to often-used long-named variables
let Service, Characteristic;
//Constants
const {BlueriiotAPI} = require('./blueriiot-api.js');
//variables
var api = new BlueriiotAPI();



module.exports = function (homebridge) {
   Service = homebridge.hap.Service;
   Characteristic = homebridge.hap.Characteristic;

   //Register Homebridge Accessory
   homebridge.registerAccessory("homebridge-blueconnect", "BlueRiiot", blueconnect);
};


//HomeBridge Accessory Constructor
function blueconnect(log, config, api) {
  this.log = log;
  this.config = config;
  this.homebridge = api;
  this.model = config.model || "Model not available";
  this.serial =  this.config.bluedeviceserial;
  this.manufacturer = config["manufacturer"] || "Blue Riiot";

  if (this.config["debug"] == "true")  {this.log('CONFIG: Swimming Pool ID '+ this.config.swimmingpoolid)};
  if (this.config["debug"] == "true")  {this.log('CONFIG: Blue Device Serial '+ this.config.bluedeviceserial)};
/*
  // Config
  this.name = config["name"];
  this.manufacturer =  "BlueRiiot";
  this.model = config.model || "Model not available";
  this.serial = config["serial"] || "Non-defined serial";
  this.fieldName = config["field_name"] || "temperature";

  this.temperature = null;*/

  this.service = new Service.TemperatureSensor(this.name);
  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({ minValue: -55, maxValue: 125 })
    .on('get', this.getState.bind(this));

  if (this.config["debug"] == "true") {this.log('BlueRiiot accessory is Created!')};
};

// Provide the available services this accessory implements
blueconnect.prototype = {

  getState : function(callback) {
        if (this.config["debug"] == "true")  {this.log('Get State has been called for : '+ this.model)};
        //Init the BlueConnect api
        api.init(this.config.email, this.config.password).then(function(){
            //this.log(api.isAuthenticated());
          }).catch( function(error){
              console.log("We have issues signing in: " + error);
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
              api.getLastMeasurements(this.config.swimmingpoolid,this.config.bluedeviceserial)
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
             maxValue: this.maxTemperature
         });



      return [this.informationService, this.temperatureService];
    },

    updateState: function () {
        if (this.config["debug"] == "true")  {this.log(' Update State has been called for : '+ this.model)};
        return error;
    }
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

// --------------------------------------------
/*function volume(log, config, api) {
    this.log = log;
    this.config = config;
    this.homebridge = api;
    this.name = config["name"];

    if (this.config.defaultVolume)
        this.defaultVolume = this.config.defaultVolume;
    else
        this.defaultVolume = 10;

    this.bulb = new Service.Lightbulb(this.config.name);
    // Set up Event Handler for bulb on/off
    this.bulb.getCharacteristic(Characteristic.On)
        .on("get", this.getPower.bind(this))
        .on("set", this.setPower.bind(this));

    this.log('all event handler was setup.')

    this.log('Volume accessory is Created!');
    this.log('defaultVolume is ' + this.defaultVolume);
};

volume.prototype = {
    getServices: function() {
      if (!this.bulb) return [];
      this.log('Homekit asked to report service');
      const infoService =
          new Service.AccessoryInformation();
      infoService
          .setCharacteristic(Characteristic.Manufacturer,
              'BlueRiiot')
          .setCharacteristic(Characteristic.SerialNumber,
              'Serial')
      return [infoService, this.bulb];
    },
    getPower: function(callback) {
       this.log('Homekit Asked Power State');
       callback(null,true)
     },
     setPower: function(on, callback) {
         this.log('Homekit Gave New Power State' + ' ' + on);
         callback(null)
    }
};*/
