const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs-extra');

const pdfRoutes = require('./controllers/pdfController');

const app = express();
app.use(express.json());

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200'],
  })
);

// Register Routes
app.use('/api', pdfRoutes);

const port = 5001;
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port);
});
