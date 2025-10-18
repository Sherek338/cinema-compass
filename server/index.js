const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/api/', (req, res) => {
  res.send('Hello World!');
});

if (process.env.MODE === 'dev') {
  app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
  });
}

module.exports = app;
