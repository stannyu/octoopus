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

// Update and save approach
// async function updateCourse(courseId) {
//   const course = await Course.findById(courseId);

//   if (!course) return;
//   course.isPublished = true;
//   course.author = 'Just an author';

//   // OR :
//   // course.set({
//   //   isPublished: true,
//   //   author: 'Just an author',
//   // });

//   const result = await course.save();
//   console.log(result);
// }

// Save first and retrieve updated
// with help of mongo update operators
async function updateCourse(courseId) {
  // findByIdAndUpdate - if needed to receive record as a result
  // here course is just a diff
  const course = await Course.update(
    { _id: courseId },
    {
      $set: {
        author: 'Stas',
        isPublished: false,
      },
    }
  );

  console.log('Course: ', course);
}

// updateCourse();
// createCourse();

getCourses();

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
