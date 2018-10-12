module.exports = {
  up: queryInterface => queryInterface.bulkInsert('notification_types', [{
    title: 'follow'
  },
  {
    title: 'publish'
  },
  {
    title: 'comment'
  },
  {
    title: 'like'
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('notification_types', null, {})
};
