const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./utils/corsOption'); 


const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const UserRoute = require('../src/routes/user')

app.use('/user', UserRoute)

 

mongoose.connect('mongodb://localhost:27017/dashboard')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });


  app.get('/', (req, res) => {
    res.send('Hello World');
  });
  

app.listen(PORT, () => {
  console.log(`Server is listening on port ${process.env.port}....`);
});

module.exports = { app };
