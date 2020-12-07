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

const authorSchema = new mongoose.Schema(
  {
    name: String,
    bio: String,
    website: String,
  },
  { collection: 'authors' }
);

const Author = mongoose.model(AUTHOR_COLLECTION, authorSchema);

const Course = mongoose.model(
  COURSE_COLLECTION,
  new mongoose.Schema(
    {
      name: String,
      author: authorSchema,
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
  const courses = await Course.find().select('name author');
  console.log(courses);
}

async function updareCourse(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = 'Danny California';
  course.save();
}

// createAuthor('Ben', 'My bio', 'My website');

// createCourse('My course', new Author({ name: 'Danny' }));
// updareCourse('5fce4d1b7d85acd9fd7cf5d5')

listCourses();

