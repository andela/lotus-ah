module.exports = {
  up: queryInterface => queryInterface.bulkInsert('roles', [{
    roleName: 'Admin',
  },
  {
    roleName: 'User',
  },
  {
    roleName: 'Author',
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('roles', null, {})
};
