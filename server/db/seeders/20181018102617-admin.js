
module.exports = {
  up: queryInterface => queryInterface.bulkInsert('users', [{
    email: 'admin@authorshaven.com',
    roleId: 1,
    password: '$2b$10$LRblHm8mNPjWYol7rXlJ7eUOnQx7kLM6Ka0MJnq7F0J.k/QssqQI2',
    isActivated: true,
  },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
