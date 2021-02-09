//imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Logic to connect to MongoDB
mongoose.connect('mongodb+srv://Admin:admin33@cluster0.fvmie.mongodb.net/<dbname>?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
);

//create express application
const app = express();

//Get route for CORS middleware (security against malicious requests)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//exports app
module.exports = app;