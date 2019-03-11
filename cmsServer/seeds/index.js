const Datadate = require('../models/datadate');
const fs = require('fs');
const mongoose = require('mongoose');

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/cms', {
    useNewUrlParser: true
}).then((err) => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log("Could not connect to database");
    process.exit();
})

let data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));

Datadate.deleteMany((err) => {
    Datadate.insertMany(data, function (err, mongooseDocuments) {
        if (err) throw err;
        console.log('insert data success');
        mongoose.disconnect()
    });
})



