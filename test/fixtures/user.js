const faker = require('faker');

export const user = {
  "email": "test@test.com",
  "username": "test@test.com",
  "password": "123456",
  "name": faker.name.firstName(),
  "location": faker.address.city(),
  "bio": faker.lorem.sentence()
};
