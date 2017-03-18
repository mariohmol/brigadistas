const faker = require('faker');

const user = {
  "email": "test@test.com",
  "username": "test@test.com",
  "password": "123456",
  "name": faker.name.firstName(),
  "city": faker.address.city(),
  "bio": faker.lorem.sentence()
};

const adminUser = {
  "email": "admin@test.com",
  "username": "admin@test.com",
  "password": "123456",
  "name": faker.name.firstName(),
  "city": faker.address.city(),
  "bio": faker.lorem.sentence()
};

const newUser = {
  "email": "new@test.com",
  "username": "new@test.com",
  "password": "654321",
  "name": faker.name.firstName(),
  "city": faker.address.city(),
  "bio": faker.lorem.sentence()
};

module.exports={user, adminUser, newUser};
