//Sample data for Project 3
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json())
//The following is an example of an array of two stations. 
//The observation array includes the ids of the observations belonging to the specified station
var stations = [
    {id: 1, description: "Reykjavik", lat: 64.1275, lon: 21.9028, observations: [2]},
    {id: 2, description: "Akureyri", lat: 65.6856, lon: 18.1002, observations: [1]}
];
var stationId = stations.length;

//The following is an example of an array of two observations.
//Note that an observation does not know which station it belongs to!
var observations = [
    {id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0},
    {id: 2, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
];

//Stations
app.get('/stations', (req, res) => {
    var returnArr = [];
    for(var i = 0; i < stations.length; i++){
        returnArr.push({id: stations[i].id, description: stations[i].description})
    }
        res.status(200).json(returnArr);
    });

app.get('/stations/:id', (req, res) => {
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

function validateObservation(req) {
    for(i = 0; i < req.body.observations.length; i++){
        var found = false;
        for(j = 0; j < observations.length; j++){
            if(req.body.observations[i] == observations[j].id){
                found = true;
            } 
        }
    }
    return found;
}

app.post('/stations', (req, res) => {

    if(req.body === null || req.body.description === undefined || req.body.lat === undefined || req.body.lon === undefined
        || !validateObservation(req)){
        res.status(404).json({
            'message': "Missing or invalid station information!"
        }); 
    } else {
        let newStation = {
            id: ++stationId,
            description: req.body.description,
            lat: req.body.lat,
            lon: req.body.lon,
            observations: req.body.observations
            }
        stations.push(newStation);
        res.status(201).json(newStation);
    }
});

app.delete('/stations/:id', (req, res) => {
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

app.put('/stations/:id', (req, res) => {
    if(req.body === null || req.body.description === undefined || req.body.lat === undefined || req.body.lon === undefined || req.body.observations === undefined){
        res.status(404).json({
            'message': "Missing station information!"
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
            'message': "Station with id " + req.params.id + " doesn't exist."
        });
    }
});

app.delete('/stations', (req, res) => {
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

//Observations


app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
});