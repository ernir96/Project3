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
var observations = [
    {id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0},
    {id: 2, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
];
var stationId = stations.length;
var observationId = observations.length;


//Stations
app.get('/stations', (req, res) => {
    var temp = [];
    for(var i = 0; i < stations.length; i++){
        temp.push({id: stations[i].id, description: stations[i].description});
    }
    res.status(200).json(temp); 
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

app.post('/stations', (req, res) => {
    if(req.body === null || req.body.description === undefined || req.body.lat === undefined || req.body.lon === undefined || req.body.observations === undefined){
        res.status(404).json({
            'message': "Missing station information!"
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
            let deleted = stations.splice(i, 1);
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
        for(let i = 0; i < stations.length; i++) {
            if(stations[i].id == req.params.id) {
                stations[i].description = req.body.description;
                stations[i].lat = req.body.lat;
                stations[i].lon = req.body.lon;
                stations[i].observations = req.body.observations;
                res.status(200).json(stations[i]);
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
    stations = [];
    res.status(200).json(returnArr);
});

/*app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
});*/

// Observations
app.get('/observations/:station', (req, res) => {
    temp = [];
    var station = Number(req.params.station);
    console.log(station);
    for(var i = 0; i < stations.length; i++){
        if(station === stations[i].id){
            for(var j = 0; j < stations[i].observations.length; j++){
                console.log("length: " + stations[i].observations.length);
                for(var k = 0; k < observations.length; k++){
                    console.log(observations[k]);
                    console.log(stations[i].observations[j]);
                    if(observations[k].id == stations[i].observations[j]){
                        //console.log(stations[i].observations[j]);
                        temp.push(observations[k]);
                        console.log(observations[k]);
                    }
                }
                //temp.push(observations[stations[i].observations[j]]);
            }
            res.status(200).json(temp);
        }
    }
    res.status(404).json({message: "No station with id: " + req.params.station});
});

app.get('/observations/:station/:id', (req, res) => {
    var id = Number(req.params.id);
    var station = Number(req.params.station);
    var observationFound = null;
    console.log(id);
    console.log(observations.length);
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
    res.status(404).json({message: "No obeservation with id: " + id});
});

app.post('/observations/:station', (req, res) => {
    if(req.body === null || req.body.temp === undefined || req.body.windSpeed === undefined || 
        req.body.windDir === undefined || req.body.prec === undefined || req.body.hum === undefined){
        res.status(404).json({'message': "Missing station information!"});
    }
    else{
        var newObservation = {
            id: ++observationId,
            date: Date.now(),
            temp: req.body.temp,
            windSpeed: req.body.windSpeed,
            windDir: req.body.windDir,
            prec: req.body.prec,
            hum: req.body.hum
        }
        console.log(newObservation.id);
        for(var i = 0; i < stations.length; i++){
            if(req.params.station == stations[i].id){
                stations[i].observations.push(newObservation.id);
            }
        }
        observations.push(newObservation);
        res.status(201).json(newObservation);
    }
});

app.delete('/observations/:station/:id', (req, res) => {
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
    res.status(404).json({message: "No obeservation with id: " + id + " in station with id: " + station});
});

app.delete('/observations/:station', (req, res) => {
    var station = req.params.station;
    var temp = [];
    for(var i = 0; i < stations.length; i++){
        if(station == stations[i].id){
            //console.log(stations[i].id);
            for(var j = 0; j < stations[i].observations.length; j++){
                for(var k = 0; k < observations.length; k++){
                    //console.log(stations[i].observations);
                    //console.log(stations[i].observations[j]);
                    //console.log(observations[k]);
                    if(stations[i].observations[j] == observations[k].id){
                        //console.log(observations[k].);
                        var deletedOb = observations.splice(k, 1);
                        temp.push(deletedOb);
                    }
                }
            }
        }
    }
    for(var i = 0; i < stations.length; i++){
        if(station == stations[i].id){
            stations[i].observations = [];
        }
    }
    res.status(200).json(temp);
});

app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
});