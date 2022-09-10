const mongoose = require('mongoose');

const { NODE_ENV, MONGO_URL } = require('.');

mongoose.Promise = global.Promise;

mongoose.set('debug', NODE_ENV === 'development');

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB Connection Error ${err}`);
});

mongoose.connection.on('Connected', () => {
  console.log('Connected to DB');
});

exports.Connect = () => {
  mongoose.connect(MONGO_URL);
  return mongoose.connection;
};