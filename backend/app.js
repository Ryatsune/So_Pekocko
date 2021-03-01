//imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

require('dotenv').config();

//Logic to connect to MongoDB
mongoose.connect('mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
);

//create express application
const app = express();

//Get route for CORS middleware (security against malicious requests)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//exports app
module.exports = app;