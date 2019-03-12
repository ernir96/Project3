//Sample data for Project 3
const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
//The following is an example of an array of two stations. 
//The observation array includes the ids of the observations belonging to the specified station
var stations = [
    {id: 1, description: "Reykjavik", lat: 64.1275, lon: 21.9028, observations: [2]},
    {id: 422, description: "Akureyri", lat: 65.6856, lon: 18.1002, observations: [1]}
];

//The following is an example of an array of two observations.
//Note that an observation does not know which station it belongs to!
var observations = [
    {id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0},
    {id: 2, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
];

//Stations
app.get('/stations', (req, res) => {
    res.status(200).json(stations); 
});

app.get('/stations/:id', (req, res) => {
    for(let i = 0; i < stations.length; i++){
        if(stations[i].id === req.params.id) {
            res.status(200).json(stations[i]);
            return;
        }
    }
    res.status(404).json({
        'message': "Station with id " + req.params.id + " not found."
    });    
});

app.post('/stations', (req, res) => {
    if(req.body === NULL || req.body.description === undefined || req.body.lat === undefined || req.body.lon === undefined){
        res.status(404).json({
            'message': "Missing station information!"
        }); 
    }
    
    res.status(200).json({'message': "Create a new station"}); 
});

app.delete('/stations/:id', (req, res) => {
    res.status(200).json({
        'message': "Delete station with specific id"
    }); 
});

app.put('/stations/:id', (req, res) => {
    res.status(200).json({
        'message': "Update station with specific id"
    }); 
});

app.delete('/stations', (req, res) => {
    res.status(200).json({
        'message': "Delete all stations"
    }); 
});

app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
});