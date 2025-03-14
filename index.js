'use strict';
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const endPoints = require('./src/routes/Routes');

const PORT = process.env.PORT || 5000

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/e-learning-portal/api/core/v01', endPoints);

app.listen(PORT, () => console.log('Server is listening on url http://localhost:' + PORT));
