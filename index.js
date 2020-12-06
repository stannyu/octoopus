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
const { func, required } = require('joi');

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
  name: { type: String, required: true },
  author: String,
  tags: [String],
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'dev'],
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
  },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(params) {
  const course = new Course({
    name: 'Computer Science course',
    author: 'Mosh',
    category: 'dev',
    tags: ['angular', 'frontend'],
    isPublished: false,
    // price: 15,
  });

  try {
    // await course.validate(); // this line will end up in catch block in case of failed validation
    const result = await course.save();
    console.log('createCourse: ', result);
  } catch (error) {
    console.log(error.errors);
    // console.log(error.message);
  }
}

async function getCourses(params) {
  const pageNumber = 2;
  const pageSize = 10;

  // const courses = await Course.find({ author: 'Mosh', isPublished: true })
  const courses = await Course.find()
    // .skip((pageNumber - 1) * pageSize) ==> represents pagination
    //.limit(pagesize) ==>
    .limit(10)
    .sort({ name: -1 })
    .select({ name: 1, tags: 1, author: 1 }); // .count() instead will return number of records
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

async function deleteCourse(courseId) {
  const deletedCourse = await Course.deleteOne({ _id: courseId });
  console.log(deletedCourse);
}

// updateCourse();
// createCourse();
// deleteCourse('5fcbc70a3158889e089d2e59');

getCourses();

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
