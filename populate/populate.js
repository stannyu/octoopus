const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose
  .connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => console.log('Could not connect to DB...', err));

const AUTHOR_COLLECTION = 'Author';
const COURSE_COLLECTION = 'Course';

const Author = mongoose.model(
  AUTHOR_COLLECTION,
  new mongoose.Schema(
    {
      name: String,
      bio: String,
      website: String,
    },
    { collection: 'authors' }
  )
);

const Course = mongoose.model(
  COURSE_COLLECTION,
  new mongoose.Schema(
    {
      name: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: AUTHOR_COLLECTION,
      },
    },
    { collection: 'courses' }
  )
);

async function createAuthor(name, bio, website) {
  const author = new Author({ name, bio, website });
  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find().populate('author', 'name bio -_id').select('name author');
  console.log(courses);
}

// createAuthor('Stas', 'My bio', 'My website');

// createCourse('My course', '5fce49ad8e7ad0d8deaff431');

listCourses();
