var request = require('request');
var parseString = require('xml2js').parseString;

var __API_URL__ = "http://api.irishrail.ie/realtime/realtime.asmx/"

function callApi(path, params){
    return new Promise(function(resolve, reject){
      request(__API_URL__ + path, function (error, response, body) {
        if (error) reject(error);
        resolve(body);
      })
    })
}

module.exports = {

  /**
  * Returns a listing of 'running trains' ie trains that are between origin and destination or are due to start within 10 minutes of the query time.
  *
  */
  getCurrentTrains: function() {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getCurrentTrainsXML', function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjTrainPositions"]["objTrainPositions"]
            );
        });
      })
    })
  },

  /**
  * Returns a list of all stations.
  *
  */
  getAllStations: function() {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getAllStationsXML', function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStation"]["objStation"]
            );
        });
      })
    })
  },

  /**
  * Returns a list of all stations - takes a single letter with 4 possible values for the StationType parameter
  * (A for All, M for Mainline, S for suburban and D for DART) any other value will be changed to A
  *
  */
  getAllStationsWithType: function(type) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getAllStationsXML_WithStationType?StationType=' + type, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStation"]["objStation"]
            );
        });
      })
    })
  },

  /**
  * Returns a listing of 'running trains' ie trains that are between origin and destination or are due to start within 10 minutes of the query time.
  * Takes a single letter with 4 possible values for the StationType parameter  (A for All, M for Mainline, S for suburban and D for DART) any other value will be changed to A
  *
  */
  getCurrentTrainsWithType: function(type) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getCurrentTrainsXML_WithTrainType?TrainType=' + type, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjTrainPositions"]["objTrainPositions"]
            );
        });
      })
    })
  },

  /**
  * Returns all trains due to serve the named station in the next 90 minutes
  *
  */
  getStationDataByName: function(name) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getStationDataByNameXML?StationDesc=' + name, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStationData"]["objStationData"]
            );
        });
      })
    })
  },

  /**
  * Returns all trains due to serve the named station in the next x minutes (x must be between 5 and 90)
  *
  */
  getStationDataByNameWithNumberOfMinutes: function(name, minutes) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getStationDataByNameXML?StationDesc=' + name + "&NumMins=" + minutes, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStationData"]["objStationData"]
            );
        });
      })
    })
  },

  /**
  * Returns all trains due to serve the named station in the next 90 minutes
  *
  */
  getStationDataByStationCode: function(code) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getStationDataByCodeXML?StationCode=' + code, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStationData"]["objStationData"]
            );
        });
      })
    })
  },

  /**
  * Returns all trains due to serve the named station in the next x minutes (x must be between 5 and 90)
  *
  */
  getStationDataByStationCodeWithNumberOfMinutes: function(code, minutes) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getStationDataByCodeXML_WithNumMins?StationCode=' + code + "&NumMins=" + minutes, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStationData"]["objStationData"]
            );
        });
      })
    })
  },

  /**
  * Returns a list of station names that contain the StationText
  *
  */
  getStationsFilter: function(text) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + 'getStationsFilterXML?StationText=' + text, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjStationFilter"]["objStationFilter"]
            );
        });
      })
    })
  },

  /**
  * Returns all stop information for the given train
  *
  */
  getTrainMovements: function(id, date) {
    return new Promise(function(resolve, reject){
      request.get(__API_URL__  + "getTrainMovementsXML?TrainId=" + id + "&TrainDate=" + date, function (error, response, body) {
        if (error) reject(error);

        parseString(body, function (err, result) {
            resolve(
              result["ArrayOfObjTrainMovements"]["objTrainMovements"]
            );
        });
      })
    })
  },



}
