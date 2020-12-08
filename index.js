const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');

//APP INSTANCE
const app = express();

//MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

//ROUTES
const { home } = require('./routes/home');
const { genres } = require('./routes/genres');
const { customers } = require('./routes/customers');
const { movies } = require('./routes/movies');
const { rentals } = require('./routes/rentals');

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

//DB
mongoose
  .connect('mongodb://localhost/octopus', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => console.log('Could not connect to DB...', err));

app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
