const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  {
    id: 1,
    name: 'course 1',
  },
  {
    id: 2,
    name: 'course 2',
  },
  {
    id: 3,
    name: 'course 3',
  },
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
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
