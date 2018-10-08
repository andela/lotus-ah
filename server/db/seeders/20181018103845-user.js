

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('users', [{
    firstname: 'Okafor',
    lastname: 'Emmanuel',
    roleId: 2,
    username: 'DevOps',
    email: 'nondefyde@gmail.com',
    isActivated: true,
    password: '$2b$10$LRblHm8mNPjWYol7rXlJ7eUOnQx7kLM6Ka0MJnq7F0J.k/QssqQI2'
  },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
