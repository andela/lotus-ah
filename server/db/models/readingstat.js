
const readingstat = (sequelize, DataTypes) => {
  const ReadingStat = sequelize.define('ReadingStat', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  ReadingStat.associate = (models) => {
    // associations can be defined here
    const { Article } = models;
    ReadingStat.belongsTo(Article, {
      as: 'article',
    });
  };
  return ReadingStat;
};

export default readingstat;
