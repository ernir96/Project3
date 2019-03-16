const hostname = '127.0.0.1';
const port = 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
//The following is an example of an array of two stations. 
//The observation array includes the ids of the observations belonging to the specified station
var stations = [
    {id: 1, description: "Reykjavik", lat: 64.1275, lon: 21.9028, observations: [2]},
    {id: 2, description: "Akureyri", lat: 65.6856, lon: 18.1002, observations: [1]}
];
var observations = [
    {id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0},
    {id: 2, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
];
function getMaxId(stations){
    var maxId = 1;
    for(var i = 0; i < stations.length; i++){
        if(stations[i].id > maxId) {
            maxId = stations[i].id;
        }
    }
    return maxId;
}
var stationId = getMaxId(stations);
var observationId = getMaxId(observations);
//Stations

function validateStationNumbers(req) {
    if(isNaN(req.body.lat) || isNaN(req.body.lon)) {
        return false;
    } else if(req.body.lat <= -90 || req.body.lat >= 90) {
        return false;
    } else if(req.body.lon <= -180 || req.body.lon >= 180) {
        return false;
    } else {
        return true;
    }
}

// (1.1) Get all stations (Only Id's and descriptions)
app.get('/api/v1/stations', (req, res) => {
    var returnArr = [];
    for(var i = 0; i < stations.length; i++){
        returnArr.push({id: stations[i].id, description: stations[i].description});
    }
    res.status(200).json(returnArr); 
});

// (1.2) Get a station with :id
app.get('/api/v1/stations/:id', (req, res) => {
    for(let i = 0; i < stations.length; i++){
        if(stations[i].id == req.params.id) {
            res.status(200).json(stations[i]);
            return;
        }
    }
    res.status(404).json({
        'message': "Station with id " + req.params.id + " not found."
    });    
});

// (1.3) Post(create) a new station
app.post('/api/v1/stations', (req, res) => {
    if(req.body === null || req.body.description === undefined
        || !validateStationNumbers(req)){
        res.status(400).json({
            'message': "Invalid station information!"
        }); 
    } else {
        let newStation = {
            id: ++stationId,
            description: req.body.description,
            lat: req.body.lat,
            lon: req.body.lon,
            observations: []
        }
        stations.push(newStation);
        res.status(201).json(newStation);
    }
});

// (1.4) Delete a station with :id
app.delete('/api/v1/stations/:id', (req, res) => {
    for(let i = 0; i < stations.length; i++){
        if(stations[i].id == req.params.id) {
            //delete all observations
            for(var j = 0; j < stations[i].observations.length; j++){
                for(k = 0; k < observations.length; k++){
                    if(observations[k].id == stations[i].observations[j]){
                        observations.splice(k, 1);
                    }
                }
            }
            //delete station
            var deleted = stations.splice(i, 1);
            res.status(200).json(deleted);
            return;
        }
    }
    res.status(404).json({
        'message': "Station with id " + req.params.id + " not found."
    });  
});

// (1.5) Put(update) a station with :id
app.put('/api/v1/stations/:id', (req, res) => {
    if(req.body === null || req.body.description === undefined
        || req.body.observations === undefined || !validateStationNumbers(req)){
        res.status(400).json({
            'message': "Invalid station information!"
        });
    } else {
        var returnArr = [];
        for(let i = 0; i < stations.length; i++) {
            if(stations[i].id == req.params.id) {
                stations[i].description = req.body.description;
                stations[i].lat = req.body.lat;
                stations[i].lon = req.body.lon;
                stations[i].observations = req.body.observations;

                returnArr.push({description: req.body.description, lat: req.body.lat, lon: req.body.lon, observations: req.body.observations})
                res.status(200).json(returnArr);
                return;
            }
        }
        res.status(404).json({
            'message': "Station with id " + req.params.id + " not found."
        });
    }
});

// (1.6) Delete all stations
app.delete('/api/v1/stations', (req, res) => {
    var returnArr = stations.slice();
    for(var i = 0; i < stations.length; i++){
        for(var j = 0; j < stations[i].observations.length; j++){
            for(var k = 0; k < observations.length; k++)
            {
                if(observations[k].id == stations[i].observations[j]){
                    observations.splice(k, 1);
                }
            }
        }
    }
    stations = [];
    res.status(200).json(returnArr);
});



// Observations
function validateObservationNumbers(req) {
    if(isNaN(req.body.temp) || isNaN(req.body.prec)
    || isNaN(req.body.windSpeed) || isNaN(req.body.hum)) {
        return false;
    } else if(req.body.prec < 0) {
        return false;
    } else if(req.body.hum <= 0 || req.body.hum >= 100) {
        return false;
    } else {
        return true;
    }
}

// (2.1) Get all observations for station with :id
app.get('/api/v1/stations/:id/observations', (req, res) => {
    returnArr = [];
    var sId = Number(req.params.id);
    for(var i = 0; i < stations.length; i++){
        if(sId === stations[i].id){
            for(var j = 0; j < stations[i].observations.length; j++){
                for(var k = 0; k < observations.length; k++){
                    if(observations[k].id == stations[i].observations[j]){
                        returnArr.push(observations[k]);
                    }
                }
            }
            res.status(200).json(returnArr);
        }
    }
    res.status(404).json({message: "No station with id: " + req.params.id});
});

// (2.2) Get observation with :id for station with id == :station
app.get('/api/v1/stations/:station/observations/:id', (req, res) => {
    var id = Number(req.params.id);
    var station = Number(req.params.station);
    for(var i = 0; i < stations.length; i++){
        for(var j = 0; j < stations[i].observations.length; j++){
            if(station === stations[i].id && id == stations[i].observations[j]){
                for(var k = 0; k < observations.length; k++){
                    if(observations[k].id === id){
                        res.status(200).json(observations[k]);
                        return;
                    }
                }
            }
        }
    }
    res.status(404).json({message: "No observation with id: " + id + " in station with id: " + station});
});

// (2.3) Post(create) an observation for station with :id
app.post('/api/v1/stations/:id/observations', (req, res) => {
    if(req.body === null || !validateObservationNumbers(req)){
        res.status(400).json({'message': "Invalid observation information!"});
        return;
    }
    var found = false;
    for(var i = 0; i < stations.length; i++){
        if(req.params.id == stations[i].id){
            found = true;
        }
    }
    if(found == false){
        res.status(404).json({'message': "No station with id: " + req.params.id});
    }
    var newObservation = {
        id: ++observationId,
        date: Date.now(),
        temp: req.body.temp,
        windSpeed: req.body.windSpeed,
        windDir: req.body.windDir,
        prec: req.body.prec,
        hum: req.body.hum
    }
    for(var i = 0; i < stations.length; i++){
        if(req.params.id == stations[i].id){
            stations[i].observations.push(newObservation.id);
        }
    }
    observations.push(newObservation);
    res.status(201).json(newObservation);
});

// (2.4) Delete observation with :id for station with id == :station
app.delete('/api/v1/stations/:station/observations/:id', (req, res) => {
    var id = Number(req.params.id);
    var station = Number(req.params.station);
    for(var i = 0; i < stations.length; i++){
        for(var j = 0; j < stations[i].observations.length; j++){
            if(station === stations[i].id && id == stations[i].observations[j]){
                stations[i].observations.splice(j, 1);
            }
        }
    }
    for(var k = 0; k < observations.length; k++){
        if(observations[k].id == id){
            var delOb = observations.splice(k, 1);
            res.status(200).json(delOb);
            return;
        }
    }
    res.status(404).json({message: "No observation with id: " + id + " in station with id: " + station});
});

// (2.5) Delete all observations for a station with :id
app.delete('/api/v1/stations/:id/observations', (req, res) => {
    var station = req.params.id;
    var returnArr = [];
    for(var i = 0; i < stations.length; i++){
        if(station == stations[i].id){
            for(var j = 0; j < stations[i].observations.length; j++){
                for(var k = 0; k < observations.length; k++){
                    if(stations[i].observations[j] == observations[k].id){
                        var deletedOb = observations.splice(k, 1);
                        returnArr.push(deletedOb);
                    }
                }
            }
        }
    }
    for(var i = 0; i < stations.length; i++){
        if(station == stations[i].id){
            stations[i].observations = [];
            res.status(200).json(returnArr);
            return;
        }
    }
    res.status(404).json({message: "Station with id " + station + " not found."});
});

//Default: Use for all invalid endpoints
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});

app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
});