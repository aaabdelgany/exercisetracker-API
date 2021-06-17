require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const User = require('./models/User');
const Exercise = require('./models/Exercise');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.error(`error connecting to mongodb ${error.message}`);
  });
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// app.use(morgan('tiny'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
app.get('/api/users/:id/logs', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  const username = user.username;
  let log = await Exercise.find({ username: username });

  if (req.query.limit) {
    log = log.slice(0, req.query.limit);
  }
  if (req.query.from && req.query.to) {
    log = log.filter(
      (ex) =>
        new Date(ex.date).toISOString().slice(0, 10) >= req.query.from &&
        new Date(ex.date).toISOString().slice(0, 10) <= req.query.to
    );
    // log = log.filter(ex=>ex.date)
  }
  res.json({ _id: userId, username, count: log.length, log });
});
app.post('/api/users', (req, res) => {
  const user = new User({ username: req.body.username });
  user.save();
  res.json(user);
});
app.post('/api/users/:id/exercises', async (req, res) => {
  console.log(req.params);
  const userId = req.params.id;
  const user = await User.findById(userId);
  const username = user.username;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date || new Date().toDateString();

  const exercise = new Exercise({
    username,
    description,
    duration,
    date,
  });
  exercise.save();
  res.json({ username, description, duration, date, _id: userId });
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
