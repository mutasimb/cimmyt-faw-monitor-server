const
  { generate } = require("generate-password"),
  { genSalt, hash } = require("bcryptjs");

module.exports = phone => new Promise((resolve, reject) => {
  const password = generate({
    length: 5,
    excludeSimilarCharacters: true,
    uppercase: false
  }) + `${phone}`.slice(`${phone}`.length - 3);

  genSalt(10)
    .then(salt => hash(password, salt))
    .then(hashed => resolve({ password, hashedPassword: hashed }))
    .catch(err => { reject(err) });
})
