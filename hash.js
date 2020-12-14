const bcrypt = require('bcrypt');

async function run() {
  const salt = await bcrypt.genSalt(10);
  console.log('Salt: ', salt);

  const hashed = await bcrypt.hash('1234', salt);
  const hashed1 = await bcrypt.hash('1234', 10);

  console.log('Hashed with salt: ', hashed);
  console.log('Hashed no salt', hashed1);

  const isEqual = await bcrypt.compare('1234', hashed);
  console.log(isEqual, ' ==> isEqual');
  console.log(hashed == hashed1);

  //   const hash = await bcrypt.hash('myPlaintextPassword', 10);
  //   console.log(hash, 'ASYNC');

  //   bcrypt
  //     .compare('1234', hashed)
  //     .then((isEqual) => {
  //       console.log(isEqual);
  //     });
}

run();
