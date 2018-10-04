const articletag = (sequelize, DataTypes) => {
  const articleTag = sequelize.define('articleTag', {
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  articleTag.associate = (models) => {
    articleTag.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
    articleTag.belongsTo(models.tag, {
      foreignKey: 'tagId'
    });
  };
  return articleTag;
};

export default articletag;
