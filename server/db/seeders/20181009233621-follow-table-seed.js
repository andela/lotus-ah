module.exports = {
  up: queryInterface => queryInterface.bulkInsert('follows', [{
    followerId: 1,
    followinId: 2,
  },
  {
    followerId: 1,
    followinId: 3,
  },
  {
    followerId: 1,
    followinId: 4,
  },
  {
    followerId: 1,
    followinId: 5,
  },
  {
    followerId: 1,
    followinId: 6,
  },
  {
    followerId: 2,
    followinId: 1,
  },
  {
    followerId: 2,
    followinId: 5,
  },
  {
    followerId: 2,
    followinId: 4,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('follows', null, {})
};
