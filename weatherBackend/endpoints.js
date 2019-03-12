//Stations
index.get('/stations', (req, res) => {
    res.status(200).json(stations); 
});

index.get('/stations/:id', (req, res) => {
    res.status(200).json({
        'message': "Show station with specific id"
    }); 
});

index.post('/stations', (req, res) => {
    res.status(200).json({
        'message': "Create a new station"
    }); 
});

index.delete('/stations/:id', (req, res) => {
    res.status(200).json({
        'message': "Delete station with specific id"
    }); 
});

index.put('/stations/:id', (req, res) => {
    res.status(200).json({
        'message': "Update station with specific id"
    }); 
});

index.delete('/stations', (req, res) => {
    res.status(200).json({
        'message': "Delete all stations"
    }); 
});
