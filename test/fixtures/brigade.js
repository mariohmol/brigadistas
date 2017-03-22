const faker = require('faker');

const brigade = {
  "name": "Test Brigade",
  "description": faker.lorem.sentence(),
  "city": faker.address.city()
};

const brigadeIn = {
  "name": "Test In Area Brigade",
  "description": faker.lorem.sentence(),
  "city": faker.address.city()
};

const brigadeOut = {
  "name": "Test Out of Area Brigade",
  "description": faker.lorem.sentence(),
  "city": faker.address.city()
};

module.exports={brigade,brigadeIn,brigadeOut};
