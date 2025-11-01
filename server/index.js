require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRouter = require('./router/authRouter');

const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URI;
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRouter);

async function startServer() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log('Connected to MongoDB');

    if (process.env.MODE === 'dev') {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();
