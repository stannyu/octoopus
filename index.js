const Joi = require('joi');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const { logger } = require('./logger');
const { auth } = require('./auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

app.use(logger);
app.use(auth);

const courses = [
  { id: 1, name: 'course 1' },
  { id: 2, name: 'course 2' },
  { id: 3, name: 'course 3' },
];

app.get('/', (req, res) => {
  res.send('Hello, Stas!');
});

app.get('/api/courses/', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`Course with id: ${req.params.id} wasn't found`);

  res.send(course);
});

app.post('/api/courses/', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(result.error.message);
  } else {
    const course = {
      id: courses.length + 1,
      name: req.body.name,
    };

    courses.push(course);
    res.send(course);
  }
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`Course with id: ${req.params.id} wasn't found`);

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`Course with id: ${req.params.id} wasn't found`);

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
