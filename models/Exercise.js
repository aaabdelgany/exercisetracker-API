const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Exercise = new Schema({
  username: { type: String, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
});

Exercise.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.__id;
  },
});

module.exports = mongoose.model('Exercise', Exercise);
