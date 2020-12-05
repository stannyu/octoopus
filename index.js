const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');

//APP INSTANCE
const app = express();

//MONGOOSE
mongoose.set('useUnifiedTopology', true);

//ROUTES
const { home } = require('./routes/home');
const { genres } = require('./routes/genres');
const { func } = require('joi');

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

//DB
mongoose
  .connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => console.log('Could not connect to DB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(params) {
  const course = new Course({
    name: 'Angular course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true,
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses(params) {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: 'Mosh', isPublished: true })
    // .skip((pageNumber - 1) * pageSize) ==> represents pagination
    //.limit(pagesize) ==>
    .limit(10)
    .sort({ name: -1 })
    .select({ name: 1, tags: 1 }); // .count() instead will return number of records
  console.log('Courses: ', courses);
}

// createCourse();
getCourses();

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
