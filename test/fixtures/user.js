const faker = require('faker');

const user = {
  "email": "test@test.com",
  "username": "test@test.com",
  "password": "123456",
  "name": faker.name.firstName(),
  "city": faker.address.city(),
  "bio": faker.lorem.sentence()
};

module.exports={user};
