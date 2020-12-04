const express = require('express');
const helmet = require('helmet');

//APP INSTANCE
const app = express();

//ROUTES
const { home } = require('./routes/home');
const { genres } = require('./routes/genres');

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
