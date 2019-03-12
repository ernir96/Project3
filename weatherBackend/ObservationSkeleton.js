const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;


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

app.get('/observations', (req, res) => {
    res.status(200).json(observations);
});

app.get('/observations/:id', (req, res) => {
    var id = Number(req.params.id);
    var observationFound = null;
    console.log(id);
    console.log(observations.length);
    for(var i = 0; i < observations.length; i++){
        console.log(observations[i]);
        if(id === observations[i].id){
            res.status(200).json(observations[i]);
            return;
        }
    }
    res.status(404).json({message: "No obeservation with id: " + id});
});

app.post('/observations', (req, res) => {
    observations.push({id: 3, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0})
    res.status(201).json(observations);
});

app.delete('/observations/:id', (req, res) => {
    var id = Number(req.params.id);
    for(var i = 0; i < observations.length; i++){
        if(id === observations[i].id){
            var delOb = observations.splice(i, 1);
            res.status(200).json(delOb);
            return;
        }
    }
    res.status(404).json({message: "No obeservation with id: " + id});
});

app.delete('/observations', (req, res) => {
    var deletedItems = observations.slice();
    observations = [];
    res.status(200).json(deletedItems);
})

app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
})


