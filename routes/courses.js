const Joi = require('joi');
const express = require('express');
const router = express.Router();

const courses = [
  { id: 1, name: 'course 1' },
  { id: 2, name: 'course 2' },
  { id: 3, name: 'course 3' },
  { id: 4, name: 'course 4' },
];

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send(`Course with id: ${req.params.id} wasn't found`);

  res.send(course);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = { courses: router };
